# aws-cloudformation-stack-resource-urls
### This project converts a list of AWS Cloudformation template resources to URLs and compiles them into a Handlebars template

## Installation
`npm run install`

## Running the script
`npm run start -- -k STACK_KEYWORD -r AWS_REGION -i TEMPLATE_INPUT_PATH -o TEMPLATE_OUTPUT_PATH`

## Templating
HTML template relies on [handlebars](https://handlebarsjs.com/)
Please use one of the existing templates as a starter or build your own. 