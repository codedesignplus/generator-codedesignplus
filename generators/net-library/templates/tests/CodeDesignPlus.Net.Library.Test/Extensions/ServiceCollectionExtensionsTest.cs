using CDP.Net.Generator.Abstractions.Options;
using Microsoft.Extensions.DependencyInjection;

namespace CDP.Net.Generator.Extensions;

public class ServiceCollectionExtensionsTest
{
    [Fact]
    public void AddLibrary_ServiceCollectionIsNull_ArgumentNullException()
    {
        // Arrange
        ServiceCollection? serviceCollection = null;

        // Act
        var exception = Assert.Throws<ArgumentNullException>(() => serviceCollection.AddLibrary(null));

        // Assert
        Assert.Equal("Value cannot be null. (Parameter 'services')", exception.Message);
    }

    [Fact]
    public void AddLibrary_ConfigurationIsNull_ArgumentNullException()
    {
        // Arrange
        var serviceCollection = new ServiceCollection();

        // Act
        var exception = Assert.Throws<ArgumentNullException>(() => serviceCollection.AddLibrary(null));

        // Assert
        Assert.Equal("Value cannot be null. (Parameter 'configuration')", exception.Message);
    }

    [Fact]
    public void AddLibrary_SectionNotExist_LibraryException()
    {
        // Arrange
        var configuration = ConfigurationUtil.GetConfiguration(new object() { });

        var serviceCollection = new ServiceCollection();

        // Act
        var exception = Assert.Throws<LibraryException>(() => serviceCollection.AddLibrary(configuration));

        // Assert
        Assert.Equal($"The section {LibraryOptions.Section} is required.", exception.Message);
    }

    [Fact]
    public void AddLibrary_CheckServices_Success()
    {
        // Arrange
        var configuration = ConfigurationUtil.GetConfiguration();

        var serviceCollection = new ServiceCollection();

        // Act
        serviceCollection.AddLibrary(configuration);

        // Assert
        var libraryService = serviceCollection.FirstOrDefault(x => x.ServiceType == typeof(ILibraryService));

        Assert.NotNull(libraryService);
        Assert.Equal(ServiceLifetime.Singleton, libraryService.Lifetime);
        Assert.Equal(typeof(LibraryService), libraryService.ImplementationType);
    }

    [Fact]
    public void AddLibrary_SameOptions_Success()
    {
        // Arrange
        var configuration = ConfigurationUtil.GetConfiguration();

        var serviceCollection = new ServiceCollection();

        // Act
        serviceCollection.AddLibrary(configuration);

        // Assert
        var serviceProvider = serviceCollection.BuildServiceProvider();

        var options = serviceProvider.GetService<IOptions<LibraryOptions>>();
        var value = options?.Value;

        Assert.NotNull(options);
        Assert.NotNull(value);

        Assert.Equal(ConfigurationUtil.LibraryOptions.Name, value.Name);
        Assert.Equal(ConfigurationUtil.LibraryOptions.Email, value.Email);
        Assert.Equal(ConfigurationUtil.LibraryOptions.Enable, value.Enable);
    }


}
