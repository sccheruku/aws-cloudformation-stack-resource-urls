import { CloudFormation } from "aws-sdk";
export function GetResourceArn(resource: CloudFormation.StackResource) {
    const accountId = resource.StackId?.split(":")[4];
    const partition = "aws";
    const region = "ca-central-1"
    switch (resource.ResourceType) {
        case "AWS::Lambda::Function":
            return `arn:${partition}:lambda:${region}:${accountId}:function:${resource.PhysicalResourceId}`;
        default:
            return resource.PhysicalResourceId;
    }
}

export function GetResourceUrl(resource: CloudFormation.StackResource) {
    const accountId = resource.StackId?.split(":")[4];
    const partition = "aws";
    const region = "ca-central-1"
    const console = "console.aws.amazon.com";
    switch (resource.ResourceType) {
        case "AWS::CertificateManager::Certificate":
            return `https://${console}/acm/home?region=${region}#/?id=${resource.PhysicalResourceId}`;
        case "AWS::Lambda::Function":
            return `https://${region}.${console}/lambda/home?region=${region}#/functions/${resource.PhysicalResourceId}`;
        case "AWS::Lambda::Layer":
            return null;
        case "AWS::IAM::User":
            return `https://${console}/iam/home?#/users/${resource.PhysicalResourceId}`;
        case "AWS::IAM::Policy":
            return `https://${console}/iam/home?#/policies/${resource.PhysicalResourceId}`;
        case "AWS::IAM::Role":
            return `https://${console}/iam/home?#/roles/${resource.PhysicalResourceId}`;
        case "AWS::Route53::HealthCheck":
            return `https://${console}/route53/healthchecks/home`;
        case "AWS::Route53::HostedZone":
            return `https://${console}/route53/v2/hostedzones#ListRecordSets/${resource.PhysicalResourceId}`;
        case "AWS::Route53:RecordSet":
            return null;
        case "AWS::S3::Bucket":
            return `https://s3.${console}/s3/buckets/${resource.PhysicalResourceId}`
        case "AWS::ApiGateway::RestApi":
        case "AWS::ApiGatewayV2::Api":
            return `https://${region}.${console}/apigateway/home?region=${region}#/apis/${resource.PhysicalResourceId}/resources`;
        case "AWS::DynamoDB::Table":
            return `https://${region}.${console}/dynamodb/home?region=${region}#tables:selected=${resource.PhysicalResourceId};tab=items`;
        case "AWS::Events::Rule":
            const urlescapedId = encodeURIComponent(resource.PhysicalResourceId);
            return `https://${region}.${console}/events/home?region=${region}#/rules/${urlescapedId}`;
        case "AWS::SecretsManager::Secret":
            return `https://${region}.${console}/secretsmanager/home?region=${region}#/secret?name=${resource.PhysicalResourceId}`;
        case "AWS::SSM::Parameter":
            return `https://${region}.${console}/systems-manager/parameters/${resource.PhysicalResourceId}/description?region=${region}`;
        default:
            return null;
    }
}