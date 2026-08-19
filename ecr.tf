resource "aws_ecr_repository" "devops_app" {
  name                 = "devops-nodejs-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "devops-nodejs-app"
    Environment = "dev"
    Project     = "terraform-aws-devops"
  }
}
