import { CloudFormation, Lambda } from "aws-sdk";
import { DescribeStackResourceOutput } from "aws-sdk/clients/cloudformation";
import * as h from "handlebars";
import * as fs from "fs";
import { GetResourceArn, GetResourceUrl } from "./get-resource-info";
import * as dotenv from "dotenv";

// If you have a .env file, we load it here
dotenv.config();

const stackKeyword = process.env.STACK_KEYWORD;
const region = process.env.REGION;
const cf = new CloudFormation({ region });
const html = fs.readFileSync(process.env.TEMPLATE_INPUT_PATH).toString("utf-8");

type StackResource = CloudFormation.StackResource & {
    ARN?: string;
    url?: string;
}

type Stack = {
    StackName: string;
    Resources: StackResource[];
    error?: Error;
}

async function GetCloudFormationStacks(): Promise<Stack[]> {
    let StackResources: Stack[] = [];
    const result = await cf.listStacks().promise();
    const stacks = result.StackSummaries?.filter(stack => stack.StackName.includes(stackKeyword)) || [];
    for (let index = 0; index < stacks.length; index++) {
        const stack = stacks[index];
        try {
            const description = await cf.describeStackResources({ StackName: stack.StackName }).promise();
            const stackResource: Stack = {
                StackName: stack.StackName, Resources: []
            };
            stackResource.Resources = description.StackResources!
                .map(r => ({
                    ...r,
                    ARN: GetResourceArn(r),
                    url: GetResourceUrl(r)
                })) as any;
            StackResources.push(stackResource);
        }
        catch (error) {
            console.log("Error", error)
            StackResources.push({
                StackName: stack.StackName, Resources: [],
                error
            });
        }
    }
    console.log(StackResources[0].Resources);
    return StackResources;
}

GetCloudFormationStacks().then(stacks => {
    const compiledHtml = h.compile(html)({ stacks });
    console.log(compiledHtml);
    fs.writeFileSync(process.env.TEMPLATE_OUTPUT_PATH, compiledHtml);
});