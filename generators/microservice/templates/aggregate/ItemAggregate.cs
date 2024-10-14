namespace <%= ns %>;

public class <%= name %>(Guid id) : AggregateRoot(id)
{
    public static <%= name %> Create(Guid id, Guid tenant, Guid createBy)
    {
       return default;
    }
}
