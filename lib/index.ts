import { CloudFormation } from "aws-sdk";
import * as hbs from "handlebars";
import * as fs from "fs";
import { GetCloudWatchUrl, GetResourceArn, GetResourceUrl } from "./get-resource-info";
import { orderBy, runInContext } from "lodash";
import * as cla from "command-line-args";
type Options = {
    keyword: string;
    region: string;
    input: string;
    output: string;
    "link-lambda-to-logs"?: boolean;
}

type StackResource = CloudFormation.StackResource & {
    ARN?: string;
    url?: string;
    secondaryUrl?: string;
}

type Stack = {
    StackName: string;
    Resources: StackResource[];
    error?: Error;
}

var options: Options = {} as any;

async function execute() {
    options = cla([
        { name: "keyword", alias: "k", type: String, },
        { name: "region", alias: "r", type: String, },
        { name: "input", alias: "i", type: String, },
        { name: "output", alias: "o", type: String, },
        { name: "link-lambda-to-logs", type: Boolean, defaultValue: false, },
    ]) as Options;

    console.log(options);

    await run(options);
}


export async function GetCloudFormationStacks(options: Options): Promise<Stack[]> {
    const cf = new CloudFormation({ region: options.region });
    let StackResources: Stack[] = [];
    const result = await cf.listStacks().promise();
    const stacks = result.StackSummaries?.filter(stack => stack.StackName.includes(options.keyword)) || [];
    for (let index = 0; index < stacks.length; index++) {
        const stack = stacks[index];
        try {
            const description = await cf.describeStackResources({ StackName: stack.StackName }).promise();
            const stackResource: Stack = {
                StackName: stack.StackName, Resources: []
            };
            stackResource.Resources = orderBy(description.StackResources!
                .map(r => ({
                    ...r,
                    ARN: GetResourceArn(r),
                    url: GetResourceUrl(r, options.region),
                    secondaryUrl: (options["link-lambda-to-logs"] && r.ResourceType === "AWS::Lambda::Function") ? GetCloudWatchUrl(r, options.region) : null
                })), ["url"], "asc");
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
    return StackResources;
}

export function readFile(filename: string) {
    return fs.readFileSync(filename).toString("utf-8");
}

async function run(options: Options) {
    const html = readFile(options.input);
    GetCloudFormationStacks(options).then(stacks => {
        const compiledHtml = hbs.compile(html)({ stacks, generatedAt: new Date() });
        console.log(compiledHtml);
        fs.writeFileSync(options.output, compiledHtml);
    });
}


execute();