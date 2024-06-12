using CDP.Net.Generator.Abstractions;
using CDP.Net.Generator.Exceptions;
using CDP.Net.Generator.Abstractions.Options;
using CDP.Net.Generator.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CDP.Net.Generator.Extensions;

/// <summary>
/// Provides a set of extension methods for CodeDesignPlus.EFCore
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Add CodeDesignPlus.EFCore configuration options
    /// </summary>
    /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection to add the service to.</param>
    /// <param name="configuration">The configuration being bound.</param>
    /// <returns>The Microsoft.Extensions.DependencyInjection.IServiceCollection so that additional calls can be chained.</returns>
    public static IServiceCollection AddLibrary(this IServiceCollection services, IConfiguration configuration)
    {
        if (services == null)
            throw new ArgumentNullException(nameof(services));

        if (configuration == null)
            throw new ArgumentNullException(nameof(configuration));

        var section = configuration.GetSection(LibraryOptions.Section);

        if (!section.Exists())
            throw new LibraryException($"The section {LibraryOptions.Section} is required.");

        services
            .AddOptions<LibraryOptions>()
            .Bind(section)
            .ValidateDataAnnotations();

        services.AddSingleton<ILibraryService, LibraryService>();

        return services;
    }

}
