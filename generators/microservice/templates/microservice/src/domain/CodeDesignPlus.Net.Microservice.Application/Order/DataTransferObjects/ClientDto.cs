﻿namespace CodeDesignPlus.Net.Microservice.Application.Order.DataTransferObjects;

public class ClientDto: IDtoBase
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
}