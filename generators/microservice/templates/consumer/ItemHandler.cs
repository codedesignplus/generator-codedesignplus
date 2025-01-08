using <%= solution %>.AsyncWorker.DomainEvents;

namespace <%= ns %>;

[QueueName("<%= aggregate %>", "<%= action %>")]
public class <%= name %>(ILogger<<%= name %>> logger) : IEventHandler<<%= domainEvent %>>
{
    public Task HandleAsync(<%= domainEvent %> data, CancellationToken token)
    {
        logger.LogInformation("<%= domainEvent %> Recived, {Json}", JsonSerializer.Serialize(data));

        return Task.CompletedTask;
    }
}
