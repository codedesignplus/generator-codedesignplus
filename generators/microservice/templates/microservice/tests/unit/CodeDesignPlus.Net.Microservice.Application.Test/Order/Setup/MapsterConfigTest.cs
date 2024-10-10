using CodeDesignPlus.Net.Microservice.Application.Order.Setup;

namespace CodeDesignPlus.Net.Microservice.Application.Test.Order.Setup;

public class MapsterConfigTest
{
    [Fact]
    public void Configure_ShouldMapProperties_Success()
    {
        // Arrange
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(typeof(MapsterConfigOrder).Assembly);

        // Act
        var mapper = new Mapper(config);

        // Assert
        Assert.NotNull(mapper);
    }
}