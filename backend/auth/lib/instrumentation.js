import { NodeSDK } from "@opentelemetry/sdk-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { ATTR_SERVER_ADDRESS, ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions"
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto"


// Create Prometheus exporter
const prometheusExporter = new PrometheusExporter({
  port: 9464,
  host: '0.0.0.0',
});

// Log when metrics are available
prometheusExporter.startServer().then(() => {
  console.log('Prometheus metrics available at http://localhost:9464/metrics');
});

const sdk = new NodeSDK({
    resource: new resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'auth-server',
        [ATTR_SERVICE_VERSION]: '1.0',
    }),
    traceExporter: new OTLPTraceExporter({
        // url: 'http://localhost:4318/v1/traces',
        url: process.env.JAEGER_URL,
    }),
    metricReader: prometheusExporter,
    instrumentations: [getNodeAutoInstrumentations()]
})

sdk.start()