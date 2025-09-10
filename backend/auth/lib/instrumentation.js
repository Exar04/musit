import { NodeSDK } from "@opentelemetry/sdk-node"
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node"
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from "@opentelemetry/sdk-metrics"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions"
import { defaultResource } from '@opentelemetry/resources'
import { ConsoleLogRecordExporter, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"

const sdk = new NodeSDK({
    resource: defaultResource({
        [ATTR_SERVICE_NAME]: 'auth-server',
        [ATTR_SERVICE_VERSION]: '1.0',
    }),
    traceExporter: new ConsoleSpanExporter(),
    metricReaders: [
        new PeriodicExportingMetricReader({
            exporter: new ConsoleMetricExporter(),
        }),
    ],
    logRecordProcessors: [ new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
    instrumentations: [getNodeAutoInstrumentations()]
})

sdk.start()