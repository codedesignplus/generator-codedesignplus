namespace <%= ns %>;

[EventKey<<%= entity %>>(1, "<%= name %>")]
public class <%= name %>DomainEvent(
     Guid aggregateId,
     Guid? eventId = null,
     DateTime? occurredAt = null,
     Dictionary<string, object>? metadata = null
) : DomainEvent(aggregateId, eventId, occurredAt, metadata)
{
    public static <%= name %>DomainEvent Create(Guid aggregateId)
    {
        return new <%= name %>DomainEvent(aggregateId);
    }
}
