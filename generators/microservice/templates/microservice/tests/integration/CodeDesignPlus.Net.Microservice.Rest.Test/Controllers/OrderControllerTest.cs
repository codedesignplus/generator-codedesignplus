﻿namespace CodeDesignPlus.Net.Microservice.Rest.Test.Controllers;

public class OrderControllerTest : ServerBase<Program>, IClassFixture<Server<Program>>
{
    public OrderControllerTest(Server<Program> server) : base(server)
    {
        server.InMemoryCollection = (x) =>
        {
            x.Add("Vault:Enabled", "false");
            x.Add("Vault:Address", "http://localhost:8200");
            x.Add("Vault:Token", "root");
            x.Add("Solution", "CodeDesignPlus");
            x.Add("AppName", "my-test");
            x.Add("RabbitMQ:UserName", "guest");
            x.Add("RabbitMQ:Password", "guest");
            x.Add("Security:ValidAudiences:0", Guid.NewGuid().ToString());
        };
    }

    [Fact]
    public async Task GetOrders_ReturnOk()
    {
        var tenant = Guid.NewGuid();
        var order = await this.CreateOrderAsync(tenant);

        var response = await this.RequestAsync("http://localhost/api/Orders", tenant, null, HttpMethod.Get);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();

        var orders = Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<OrderDto>>(json);

        Assert.NotNull(orders);
        Assert.NotEmpty(orders);
        Assert.Contains(orders, x => x.Id == order.Id);
    }

    [Fact]
    public async Task GetOrderById_ReturnOk()
    {
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}", tenant, null, HttpMethod.Get);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();

        var order = Newtonsoft.Json.JsonConvert.DeserializeObject<OrderDto>(json);

        Assert.NotNull(order);
        Assert.Equal(orderCreated.Id, order.Id);
        Assert.Equal(orderCreated.Client.Name, order.Client.Name);
        Assert.Equal(orderCreated.Client.Id, order.Client.Id);
    }

    [Fact]
    public async Task CreateOrder_ReturnNoContent()
    {
        var tenant = Guid.NewGuid();
        var data = new CreateOrderDto()
        {
            Id = Guid.NewGuid(),
            Client = new ClientDto()
            {
                Name = "CodeDesignPlus",
                Id = Guid.NewGuid(),
                Document = "1234567890",
                TypeDocument = "CC"
            },
            Address = new AddressDto()
            {
                Country = "Colombia",
                State = "Bogota",
                City = "Bogota",
                Address = "Calle 123",
                CodePostal = 123456
            }
        };

        var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await this.RequestAsync("http://localhost/api/Orders", tenant, content, HttpMethod.Post);

        var order = await this.GetRecordAsync(data.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        Assert.Equal(data.Id, order.Id);
        Assert.Equal(data.Client.Name, order.Client.Name);
        Assert.Equal(data.Client.Id, order.Client.Id);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.Equal(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.Equal(0, order.UpdatedAt);
    }

    [Fact]
    public async Task CancelOrder_ReturnNoContent()
    {
        // Arrange
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        var cancelOrder = new CancelOrderDto() { Id = Guid.NewGuid(), Reason = "Cancellation by address" };

        var content = BuildBody(cancelOrder);

        // Act
        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/cancel", tenant, content, HttpMethod.Delete);

        var order = await this.GetRecordAsync(orderCreated.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal(cancelOrder.Reason, order.ReasonForCancellation);
        Assert.Equal(Domain.Enums.OrderStatus.Cancelled, order.Status);
        Assert.NotNull(order.CancelledAt);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.NotEqual(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.NotEqual(0, order.UpdatedAt);
    }

    [Fact]
    public async Task CompleteOrder_ReturnNoContent()
    {
        // Arrange
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        // Act
        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/complete", tenant, null, HttpMethod.Patch);

        var order = await this.GetRecordAsync(orderCreated.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal(Domain.Enums.OrderStatus.Completed, order.Status);
        Assert.NotNull(order.CompletedAt);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.NotEqual(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.NotEqual(0, order.UpdatedAt);
    }

    [Fact]
    public async Task AddProductToOrder_ReturnNoContent()
    {
        // Arrange
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        var addProduct = new AddProductToOrderDto()
        {
            Id = orderCreated.Id,
            Description = "Product Test",
            IdProduct = Guid.NewGuid(),
            Name = "Product Test",
            Price = 100,
            Quantity = 2
        };

        var content = BuildBody(addProduct);

        // Act
        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/products", tenant, content, HttpMethod.Post);

        var order = await this.GetRecordAsync(orderCreated.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Single(order.Products);
        Assert.Equal(addProduct.Description, order.Products.First().Description);
        Assert.Equal(addProduct.IdProduct, order.Products.First().Id);
        Assert.Equal(addProduct.Name, order.Products.First().Name);
        Assert.Equal(addProduct.Price, order.Products.First().Price);
        Assert.Equal(addProduct.Quantity, order.Products.First().Quantity);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.NotEqual(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.NotEqual(0, order.UpdatedAt);
    }

    [Fact]
    public async Task UpdateQuantityProduct_ReturnNoContent()
    {
        // Arrange
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        var addProduct = new AddProductToOrderDto()
        {
            Id = orderCreated.Id,
            Description = "Product Test",
            IdProduct = Guid.NewGuid(),
            Name = "Product Test",
            Price = 100,
            Quantity = 2
        };

        var content = BuildBody(addProduct);

        await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/products", tenant, content, HttpMethod.Post);

        var updateQuantity = new UpdateQuantityProductDto()
        {
            Id = orderCreated.Id,
            ProductId = addProduct.IdProduct,
            Quantity = 5
        };

        content = BuildBody(updateQuantity);

        // Act
        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/products/{addProduct.IdProduct}", tenant, content, HttpMethod.Put);

        var order = await this.GetRecordAsync(orderCreated.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Single(order.Products);
        Assert.Equal(updateQuantity.Quantity, order.Products.First().Quantity);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.NotEqual(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.NotEqual(0, order.UpdatedAt);
    }

    [Fact]
    public async Task RemoveProductFromOrder_ReturnNoContent()
    {
        // Arrange
        var tenant = Guid.NewGuid();
        var orderCreated = await this.CreateOrderAsync(tenant);

        var addProduct = new AddProductToOrderDto()
        {
            Id = orderCreated.Id,
            Description = "Product Test",
            IdProduct = Guid.NewGuid(),
            Name = "Product Test",
            Price = 100,
            Quantity = 2
        };

        var content = BuildBody(addProduct);

        await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/products", tenant, content, HttpMethod.Post);

        // Act
        var response = await this.RequestAsync($"http://localhost/api/Orders/{orderCreated.Id}/products/{addProduct.IdProduct}", tenant, null, HttpMethod.Delete);

        var order = await this.GetRecordAsync(orderCreated.Id);

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Empty(order.Products);
        Assert.NotEqual(Guid.Empty, order.CreatedBy);
        Assert.NotEqual(Guid.Empty, order.UpdatedBy);
        Assert.NotEqual(0, order.CreatedAt);
        Assert.NotEqual(0, order.UpdatedAt);
    }

    private static StringContent BuildBody(object data)
    {
        var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        return content;
    }

    private async Task<CreateOrderDto> CreateOrderAsync(Guid tenant)
    {
        var data = new CreateOrderDto()
        {
            Id = Guid.NewGuid(),
            Client = new ClientDto()
            {
                Name = "CodeDesignPlus",
                Id = Guid.NewGuid(),
                Document = "1234567890",
                TypeDocument = "CC"
            },
            Address = new AddressDto()
            {
                Country = "Colombia",
                State = "Bogota",
                City = "Bogota",
                Address = "Calle 123",
                CodePostal = 123456
            }
        };

        var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        await this.RequestAsync("http://localhost/api/Orders", tenant, content, HttpMethod.Post);

        return data;
    }

    private async Task<OrderDto> GetRecordAsync(Guid id)
    {
        var response = await this.RequestAsync($"http://localhost/api/Orders/{id}", Guid.NewGuid(), null, HttpMethod.Get);

        var json = await response.Content.ReadAsStringAsync();

        return Newtonsoft.Json.JsonConvert.DeserializeObject<OrderDto>(json)!;
    }

    private async Task<HttpResponseMessage> RequestAsync(string uri, Guid tenant, HttpContent? content, HttpMethod method)
    {
        var httpRequestMessage = new HttpRequestMessage()
        {
            RequestUri = new Uri(uri),
            Content = content,
            Method = method
        };
        httpRequestMessage.Headers.Authorization = new AuthenticationHeaderValue("TestAuth");
        httpRequestMessage.Headers.Add("X-Tenant", tenant.ToString());

        var response = await Client.SendAsync(httpRequestMessage);

        return response;
    }

}
