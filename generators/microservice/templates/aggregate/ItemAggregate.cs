namespace <%= ns %>;

public class <%= name %>Aggregate(Guid id) : AggregateRoot(id)
{
    public static <%= name %>Aggregate Create(Guid id, Guid tenant, Guid createBy)
    {
       return default;
    }
}
