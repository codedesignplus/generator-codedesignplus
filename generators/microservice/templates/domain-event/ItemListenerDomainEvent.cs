namespace <%= ns %>;

[EventKey<<%= entity %>>(1, "<%= name %>", "<%= microservice %>")]
public class <%= name %>(
     Guid aggregateId,
     Guid? eventId = null,
     Instant? occurredAt = null,
     Dictionary<string, object>? metadata = null
) : DomainEvent(aggregateId, eventId, occurredAt, metadata)
{
    public static <%= name %> Create(Guid aggregateId)
    {
        return new <%= name %>(aggregateId);
    }
}
