
# DynamoDB Table: TicketManage

resource "aws_dynamodb_table" "ticket_table" {
  name         = "TicketManage"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ticket_number"

  attribute {
    name = "ticket_number"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  attribute {
    name = "product_rating"
    type = "N"
  }

  global_secondary_index {
    name            = "ticketCategoryRatingIndex"
    hash_key        = "category"
    range_key       = "product_rating"
    projection_type = "ALL"
  }
}

################
# DynamoDB Table: Examiners
################
resource "aws_dynamodb_table" "examiners_table" {
  name         = "examiners"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "examiner_id"

  attribute {
    name = "examiner_id"
    type = "S"
  }

  // Add more attributes and secondary indexes as required
}