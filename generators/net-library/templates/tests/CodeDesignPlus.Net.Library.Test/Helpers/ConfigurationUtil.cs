using System.Text.Json;
using CDP.Net.Generator.Abstractions.Options;

namespace CDP.Net.Generator.Test.Helpers;

public static class ConfigurationUtil
{
    public static readonly LibraryOptions LibraryOptions = new()
    {
        Enable = true,
        Name = nameof(Abstractions.Options.LibraryOptions.Name),
        Email = $"{nameof(Abstractions.Options.LibraryOptions.Name)}@codedesignplus.com"
    };

    public static IConfiguration GetConfiguration()
    {
        return GetConfiguration(new AppSettings()
        {
            Library = LibraryOptions
        });
    }

    public static IConfiguration GetConfiguration(object? appSettings = null)
    {
        var json = JsonSerializer.Serialize(appSettings);

        var memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(json));

        return new ConfigurationBuilder().AddJsonStream(memoryStream).Build();
    }

}
