namespace <%= ns %>;

public sealed partial class <%= name %>
{
    [GeneratedRegex(@"^0x[0-9]{32}$")]
    private static partial Regex Regex();

    public string Value { get; private set; }

    private <%= name %>(string value)
    {
        DomainGuard.IsNullOrEmpty(value, Errors.UnknownError);

        DomainGuard.IsFalse(Regex().IsMatch(value), Errors.UnknownError);

        this.Value = value;
    }

    public static <%= name %> Create(string value)
    {
        return new <%= name %>(value);
    }
}
