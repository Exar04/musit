import { trace, SpanStatusCode } from "@opentelemetry/api";
const tracer = trace.getTracer('testRoute', '1.0');

// Controller with instrumentation
const test = async (req, res) => {
    const span = tracer.startSpan('testRoute-handler');
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.route', '/');

    try {
        span.addEvent('Handling test route');
        res.status(200).json({ message: 'Test route is working' });

        span.setStatus({ code: SpanStatusCode.OK });  // OK
    } catch (err) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        res.status(500).json({ message: 'Server error' });
    } finally {
        span.end();
    }
};

const testLateResponse = async (req, res) => {
    const span = tracer.startSpan('testLateResponse-handler');
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.route', '/latency');

    try {
        span.addEvent('Simulating latency');
        await new Promise(resolve => setTimeout(resolve, 2000));
        res.status(200).json({ message: 'Got Late response Test is working' });

        span.setStatus({ code: SpanStatusCode.OK });  // OK
    } catch (err) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        res.status(500).json({ message: 'Server error' });
    } finally {
        span.end();
    }
};

export {test, testLateResponse}