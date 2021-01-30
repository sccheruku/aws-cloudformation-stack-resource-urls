# aws-cloudformation-stack-resource-urls
### This project converts a list of AWS Cloudformation template resources to URLs and compiles them into a Handlebars template

## Installation
`npm run install`

## Setup
The following environment variables need to be present before running the script: 
`STACK_KEYWORD`: Cloudformation stacks which contain the following keyword will be included in the collection. 

`REGION`: AWS Region

`TEMPLATE_INPUT_PATH`: Location of your handlebars template. eg: template/infrastructure-map.hbs

`TEMPLATE_OUTPUT_PATH`: Output location for the compiled HTML file. eg: template/infrastructure-map.hbs output/infrastructure-map.html

## Running the script
`npm run start`

## Templating
HTML template relies on [handlebars](https://handlebarsjs.com/)
Please use one of the existing templates as a starter or build your own. 