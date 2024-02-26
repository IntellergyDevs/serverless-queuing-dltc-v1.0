#############################// to store the state file in s3

terraform {
  backend "s3" {
    bucket = "qtdevtest"
    key    = "terraform/backend.tf"
    region = "us-east-1"
  }
}