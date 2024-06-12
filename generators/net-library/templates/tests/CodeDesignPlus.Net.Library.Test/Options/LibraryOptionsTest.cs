using CDP.Net.Generator.Abstractions.Options;

namespace CDP.Net.Generator.Test.Options;

public class LibraryOptionsTest
{
    [Fact]
    public void LibraryOptions_DefaultValues_Valid()
    {
        // Arrange
        var options = new LibraryOptions()
        {
            Name = Guid.NewGuid().ToString()
        };

        // Act
        var results = options.Validate();

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void LibraryOptions_NameIsRequired_FailedValidation()
    {
        // Arrange
        var options = new LibraryOptions();

        // Act
        var results = options.Validate();

        // Assert
        Assert.Contains(results, x => x.ErrorMessage == "The Name field is required.");
    }

    [Fact]
    public void LibraryOptions_EmailIsRequired_FailedValidation()
    {
        // Arrange
        var options = new LibraryOptions()
        {
            Enable = true,
            Name = Guid.NewGuid().ToString(),
            Email = null
        };

        // Act
        var results = options.Validate();

        // Assert
        Assert.Contains(results, x => x.ErrorMessage == "The Email field is required.");
    }

    [Fact]
    public void LibraryOptions_EmailIsInvalid_FailedValidation()
    {
        // Arrange
        var options = new LibraryOptions()
        {
            Enable = true,
            Name = Guid.NewGuid().ToString(),
            Email = "asdfasdfsdfgs"
        };

        // Act
        var results = options.Validate();

        // Assert
        Assert.Contains(results, x => x.ErrorMessage == "The Email field is not a valid e-mail address.");
    }
}
