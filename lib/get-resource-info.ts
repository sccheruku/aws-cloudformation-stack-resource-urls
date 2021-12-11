import { CloudFormation } from "aws-sdk";

const _console = "console.aws.amazon.com";

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

export function GetResourceUrl(resource: CloudFormation.StackResource, region: string) {
    const accountId = resource.StackId?.split(":")[4];
    const partition = "aws";
    switch (resource.ResourceType) {
        case "AWS::CertificateManager::Certificate":
            return `https://${_console}/acm/home?region=${region}#/?id=${resource.PhysicalResourceId}`;
        case "AWS::Lambda::Function":
            return `https://${region}.${_console}/lambda/home?region=${region}#/functions/${resource.PhysicalResourceId}`;
        case "AWS::Lambda::Layer":
            return null;
        case "AWS::IAM::User":
            return `https://${_console}/iam/home?#/users/${resource.PhysicalResourceId}`;
        case "AWS::IAM::Policy":
            return `https://${_console}/iam/home?#/policies/${resource.PhysicalResourceId}`;
        case "AWS::IAM::Role":
            return `https://${_console}/iam/home?#/roles/${resource.PhysicalResourceId}`;
        case "AWS::Route53::HealthCheck":
            return `https://${_console}/route53/healthchecks/home`;
        case "AWS::Route53::HostedZone":
            return `https://${_console}/route53/v2/hostedzones#ListRecordSets/${resource.PhysicalResourceId}`;
        case "AWS::Route53:RecordSet":
            return null;
        case "AWS::S3::Bucket":
            return `https://s3.${_console}/s3/buckets/${resource.PhysicalResourceId}`
        case "AWS::ApiGateway::RestApi":
        case "AWS::ApiGatewayV2::Api":
            return `https://${region}.${_console}/apigateway/home?region=${region}#/apis/${resource.PhysicalResourceId}/resources`;
        case "AWS::DynamoDB::Table":
            return `https://${region}.${_console}/dynamodb/home?region=${region}#tables:selected=${resource.PhysicalResourceId};tab=items`;
        case "AWS::Events::Rule":
            const urlescapedId = encodeURIComponent(resource.PhysicalResourceId);
            return `https://${region}.${_console}/events/home?region=${region}#/rules/${urlescapedId}`;
        case "AWS::SecretsManager::Secret":
            return `https://${region}.${_console}/secretsmanager/home?region=${region}#/secret?name=${resource.PhysicalResourceId}`;
        case "AWS::SSM::Parameter":
            return `https://${region}.${_console}/systems-manager/parameters/${resource.PhysicalResourceId}/description?region=${region}`;
        case "AWS::CodePipeline::Pipeline":
            return `https://${region}.${_console}/codesuite/codepipeline/pipelines/${resource.PhysicalResourceId}/view?region=${region}`;
        case "AWS::CodeCommit::Repository":
            return `https://${region}.${_console}/codesuite/codecommit/repositories/${resource.PhysicalResourceId}/setup?region=${region}`;
        case "AWS::CodeBuild::Project":
            return `https://${region}.${_console}/codesuite/codebuild/${accountId}/projects/${resource.PhysicalResourceId}/history?region=${region}`;
        case "AWS::SNS::Topic":
            return `https://${region}.${_console}/sns/v3/home?region=${region}#/topic/${resource.PhysicalResourceId}`;
        case "AWS::SNS::Subscription":
            return `https://${region}.${_console}/sns/v3/home?region=${region}#/subscription/${resource.PhysicalResourceId}`;
        case "AWS::IAM::Group":
            return `https://${_console}/iamv2/home?#/groups/details/${resource.PhysicalResourceId}?section=users`;
        case "AWS::CloudFront::Distribution":
            return `https://${_console}/cloudfront/v3/home?region=${region}#/distributions/${resource.PhysicalResourceId}`;
        case "AWS::ApiGateway::DomainName":
            return `https://${region}.${_console}/apigateway/main/publish/domain-names?domain=${resource.PhysicalResourceId}&region=${region}`;
        default: {
            console.log("Unable to handle resource", resource);
            return null;
        }
    }
}
export function GetCloudWatchUrl(r: CloudFormation.StackResource, region: string): any {
    return `https://${region}.${_console}/cloudwatch/home?region=${region}#logStream:group=%252Faws%252Flambda%252F${r.PhysicalResourceId}`
}
