##############
# API Gateway#
// APIs for list and store

resource "aws_api_gateway_rest_api" "user_apigw" {
  name        = "user_apigw"
  description = "User API Gateway"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "ticket" {
  rest_api_id = aws_api_gateway_rest_api.user_apigw.id
  parent_id   = aws_api_gateway_rest_api.user_apigw.root_resource_id
  path_part   = "ticket"
}

resource "aws_api_gateway_resource" "list_tickets" {
  rest_api_id = aws_api_gateway_rest_api.user_apigw.id
  parent_id   = aws_api_gateway_rest_api.user_apigw.root_resource_id
  path_part   = "list_tickets"
}

resource "aws_api_gateway_method" "storeticket" {
  rest_api_id   = aws_api_gateway_rest_api.user_apigw.id
  resource_id   = aws_api_gateway_resource.ticket.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "list_tickets" {
  rest_api_id   = aws_api_gateway_rest_api.user_apigw.id
  resource_id   = aws_api_gateway_resource.list_tickets.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "updateticket" {
  rest_api_id   = aws_api_gateway_rest_api.user_apigw.id
  resource_id   = aws_api_gateway_resource.ticket.id
  http_method   = "PUT" # or "PATCH" depending on your API design
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "storeticket_lambda" {
  rest_api_id = aws_api_gateway_rest_api.user_apigw.id
  resource_id = aws_api_gateway_resource.ticket.id
  http_method = aws_api_gateway_method.storeticket.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = aws_lambda_function.StoreTicketHandler.invoke_arn
}

resource "aws_api_gateway_integration" "list_tickets_lambda" {
  rest_api_id = aws_api_gateway_rest_api.user_apigw.id
  resource_id = aws_api_gateway_resource.list_tickets.id
  http_method = aws_api_gateway_method.list_tickets.http_method

  integration_http_method = "GET"
  type                    = "AWS_PROXY"

  uri = aws_lambda_function.ListTicketsHandler.invoke_arn
}

resource "aws_api_gateway_integration" "updateticket_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.user_apigw.id
  resource_id             = aws_api_gateway_resource.ticket.id
  http_method             = aws_api_gateway_method.updateticket.http_method
  integration_http_method = "POST" # Lambda uses POST for all invocations
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.UpdateTicketHandler.invoke_arn
}

resource "aws_lambda_permission" "apigw_StoreticketHandler" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.StoreTicketHandler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_apigw.execution_arn}/*/POST/ticket"
}

resource "aws_lambda_permission" "apigw_ListticketsHandler" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ListTicketsHandler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_apigw.execution_arn}/*/GET/list_tickets"
}

resource "aws_lambda_permission" "apigw_UpdateTicketHandler" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.UpdateTicketHandler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_apigw.execution_arn}/*/PUT/ticket" # or PATCH
}

resource "aws_cloudwatch_log_group" "main_api_gw" {
  name              = "/aws/api-gw/${aws_api_gateway_rest_api.user_apigw.name}"
  retention_in_days = 14
}

resource "aws_api_gateway_deployment" "ticket_apigw_deployment" {
  depends_on = [
    aws_api_gateway_method.storeticket,
    aws_api_gateway_method.list_tickets,
    aws_api_gateway_method.updateticket,
    aws_api_gateway_integration.storeticket_lambda,
    aws_api_gateway_integration.list_tickets_lambda,
    aws_api_gateway_integration.updateticket_lambda,
  ]
  rest_api_id = aws_api_gateway_rest_api.user_apigw.id
  stage_name  = "Dev"
}