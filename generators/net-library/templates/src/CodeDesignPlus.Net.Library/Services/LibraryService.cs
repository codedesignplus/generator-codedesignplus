using CDP.Net.Generator.Abstractions.Options;

namespace CDP.Net.Generator.Services;

/// <summary>
/// Default implementation of the <see cref="ILibraryService"/>
/// </summary>
public class LibraryService : ILibraryService
{
    /// <summary>
    /// Logger Service
    /// </summary>
    private readonly ILogger<LibraryService> logger;
    /// <summary>
    /// Library Options
    /// </summary>
    private readonly LibraryOptions options;

    /// <summary>
    /// Initialize a new instance of the <see cref="LibraryService"/>
    /// </summary>
    /// <param name="logger">Logger Service</param>
    /// <param name="options">Library Options</param>
    public LibraryService(ILogger<LibraryService> logger, IOptions<LibraryOptions> options)
    {
        this.logger = logger;
        this.options = options.Value;
    }

    /// <summary>
    /// Asynchronously echoes the specified value. 
    /// </summary>
    /// <param name="value">The value to echo.</param>
    /// <returns>A task that represents the asynchronous echo operation. The result of the task is the echoed value as a</returns>
    public Task<string> EchoAsync(string value)
    {
        this.logger.LogDebug("{section}, Echo {enable}", LibraryOptions.Section, options.Enable);

        return Task.FromResult(value);
    }
}
