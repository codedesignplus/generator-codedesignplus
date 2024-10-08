namespace <%= ns %>;

[QueueName("<%= entity %>", "<%= action %>")]
public class <%= name %>Handler(ILogger<<%= name %>Handler> logger) : IEventHandler<<%= name %>DomainEvent>
{
    public Task HandleAsync(<%= name %>DomainEvent data, CancellationToken token)
    {
        logger.LogInformation("<%= name %>DomainEvent Recived, {AggregateId}, {Json}", data.AggregateId, JsonConvert.SerializeObject(data));

        return Task.CompletedTask;
    }
}
