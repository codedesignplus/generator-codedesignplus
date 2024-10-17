namespace <%= ns %>;

[QueueName("<%= entity %>", "<%= action %>")]
public class <%= name %>(ILogger<<%= name %>> logger) : IEventHandler<<%= domainEvent %>>
{
    public Task HandleAsync(<%= domainEvent %> data, CancellationToken token)
    {
        logger.LogInformation("<%= domainEvent %> Recived, {Json}", JsonConvert.SerializeObject(data));

        return Task.CompletedTask;
    }
}
