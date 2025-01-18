# 👋 Your Sidekick for CodeDesignPlus.Net Microservices! 🚀

Hey there, developer! 👋 Tired of starting your microservices from scratch? Worry no more! The `generator-codedesignplus` is here to simplify and standardize the creation of your microservices based on the `CodeDesignPlus.Net.Microservice` archetype. Imagine having a tool that guides you step by step, generating the structure and key components of your microservice—all ready for you to focus on the business logic! 🤩

## What's the Buzz About CodeDesignPlus.Net.Microservice? 🤔

`CodeDesignPlus.Net.Microservice` is like your "starter kit" for building modern .NET microservices. It's a starting point that promotes separation of responsibilities, maintainability, and scalability. Forget tedious configurations, as it includes a well-defined project structure, default settings, and utility libraries. In short, it's the solid foundation you need to develop robust microservices quickly and efficiently. 😎

## A Journey into the World of Domain-Driven Design (DDD) 🗺️

Before you start using the generator, it's important to know some key concepts of DDD:

*   **Domain:** It's the "world" of your software, the area of knowledge it operates on. Think of the domain as your business context with its own rules. For example, in an e-commerce platform, the domain might be "order management" or "product administration."
*   **Aggregate:** A cluster of entities treated as a unit, with a root entity acting as the "entry point." Aggregates are responsible for maintaining consistency within their boundaries. An order with its order lines is a good example.
*   **Entity:** An object with its own identity, persisting over time and having a defined lifecycle. Each entity has a unique identifier. A user with their name, email, and other details is an entity.
*   **Value Object:** An object without its own identity, defined by its attributes. They are immutable and compared by value. An address or a currency are perfect examples.
*   **Domain Event:** A notification of something that has happened in the domain. They are immutable and represent historical facts. Examples include "OrderCreated" or "UserRegistered."
*   **Repository:** A mechanism that "hides" access to persistent data. It provides an interface for your application to interact with the database without worrying about technical details.
*   **Command:** An intention to perform an action that changes the system's state. These are the orders you give, such as "CreateOrder" or "UpdateUser."
*   **Query:** A request to get information from the system without modifying anything. For example, "GetUserById" or "FindProductsByName."

## Configuration Flags: Customize Your Microservice! 🛠️

| Flag                       | Description                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--organization`           | The name of your organization—the base of your namespace!                                                                  |
| `--microservice`           | The name of your microservice—the heart of your project!                                                                     |
| `--description`            | A detailed description—so everyone understands its purpose!                                                                |
| `--contact-name`           | The name of the contact person—the one who always has the answers!                                                           |
| `--contact-email`          | The contact email—the way to communicate with the responsible person!                                                        |
| `--vault`                  | The name of the vault for managing secrets—your microservice's safe!                                                        |
| `--is-crud`                | Indicates whether your microservice will be a CRUD—the easy path for data management!                                        |
| `--aggregate`              | The name of the root aggregate—the foundation of your domain!                                                              |
| `--enable-grpc`            | Enables the gRPC API—communication at the speed of light!                                                                    |
| `--enable-async-worker`    | Enables an asynchronous worker—for background tasks without stress!                                                          |
| `--consumer-name`          | The name of the event consumer—the one who always keeps track of everything!                                               |
| `--consumer-aggregate`     | The aggregate the consumer belongs to—context is key!                                                                      |
| `--consumer-action`        | The action to be performed by the consumer upon receiving an event—respond to the action!                                     |
| `--domain-events`          | A comma-separated list of domain events—your microservice's communication!                                                   |
| `--entities`               | A comma-separated list of entities—objects with identity!                                                                 |
| `--commands`               | A comma-separated list of commands—actions that change the system!                                                            |
| `--queries`                | A comma-separated list of queries—requests that fetch information!                                                          |
| `--repository`             | The name of the aggregate for which the repository is created or consulted—access to your data!                              |
| `--controller`             | The name of the controller—the entry point to your microservice!                                                             |
| `--proto-name`             | The base name of the `.proto` file—the definition of your gRPC API!                                                           |
| `--valueObjects`           | A comma-separated list of value object names—objects without identity!                                                       |
| `--dataTransferObject`     | A comma-separated list of DTO names—the shape of the data as it travels!                                                     |

## Available Commands: Your Guide in Development! 🚀

| Command                                   | Description                                                                                                                                     | Main Options                                                                                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yo codedesignplus:microservice microservice` | Creates the base structure of a new microservice. Choose between a CRUD or custom pattern.                                                   | `--organization`, `--microservice`, `--description`, `--contact-name`, `--contact-email`, `--vault`, `--is-crud`, `--aggregate`, `--enable-grpc`, `--enable-async-worker`, `--consumer-name`, `--consumer-aggregate`, `--consumer-action`, `--domain-events`, `--entities`, `--commands`, `--queries` |
| `yo codedesignplus:microservice aggregate`   | Creates a new aggregate within an existing microservice.                                                                                          | `--organization`, `--microservice`, `--aggregate`                                                                                                                                      |
| `yo codedesignplus:microservice entity`      | Creates one or more entities.                                                                                                                        | `--organization`, `--microservice`, `--entities`                                                                                                                                         |
| `yo codedesignplus:microservice valueObject` | Creates one or more value objects.                                                                                                                  | `--organization`, `--microservice`, `--valueObjects`                                                                                                                                    |
| `yo codedesignplus:microservice domainEvent`| Creates one or more domain events associated with an aggregate.                                                                                        | `--organization`, `--microservice`, `--aggregate`, `--domainEvents`                                                                                                                       |
| `yo codedesignplus:microservice repository`  | Creates a repository for a specific aggregate.                                                                                               | `--organization`, `--microservice`, `--repository`                                                                                                                                        |
| `yo codedesignplus:microservice controller`  | Creates a controller to handle incoming requests.                                                                                       | `--organization`, `--microservice`, `--controller`                                                                                                                                      |
| `yo codedesignplus:microservice proto`      | Creates a `.proto` file for a gRPC service.                                                                                                   | `--organization`, `--microservice`, `--proto-name`                                                                                                                                      |
| `yo codedesignplus:microservice consumer`   | Creates a consumer that reacts to domain events.                                                                                            | `--organization`, `--microservice`, `--consumer-name`, `--consumer-aggregate`, `--consumer-action`                                                                                               |
| `yo codedesignplus:microservice query`       | Creates one or more queries to retrieve data without modifying the state.                                                                     | `--organization`, `--microservice`, `--aggregate`, `--repository`, `--queries`                                                                                                              |
| `yo codedesignplus:microservice command`     | Creates one or more commands to perform actions that change the system state.                                                               | `--organization`, `--microservice`, `--aggregate`, `--repository`, `--commands`                                                                                                           |
| `yo codedesignplus:microservice dto`         | Creates one or more Data Transfer Objects (DTOs) to transfer data.                                                                               | `--organization`, `--microservice`, `--aggregate`, `--dataTransferObject`                                                                                                        |
| `yo codedesignplus:microservice grpc`       | Creates a gRPC project.                                                                                                                           | `--organization`, `--microservice`                                                                                                                                                  |
| `yo codedesignplus:microservice asyncWorker`| Creates an async worker project.                                                                                                          | `--organization`, `--microservice`                                                                                                                                                  |

### 1. Creating a Microservice: The Beginning of It All!

`yo codedesignplus:microservice microservice`

This is the starting point for your new microservice. You can choose between a **CRUD** or **Custom** microservice, each with its own magic and design patterns.

#### CRUD Microservice: Straight to the Point!

A CRUD microservice focuses on managing data: create, read, update, and delete. It's ideal for scenarios where data persistence is the main concern.

```bash
yo codedesignplus:microservice microservice \
    --organization acme \
    --microservice users \
    --description "Microservice to manage platform users." \
    --contact-name "Jane Doe" \
    --contact-email "jane.doe@example.com" \
    --vault vault-acme \
    --is-crud \
    --aggregate user \
    --enable-grpc \
    --enable-async-worker \
    --consumer-name userRegistered \
    --consumer-aggregate user \
    --consumer-action send-welcome-email
```

**Note:** The REST entrypoint is created by default when creating a microservice.

#### Custom Microservice: Maximum Flexibility!

A custom microservice is for complex business logic and events, not just CRUD operations. It's perfect if the workflow is more important than data storage.

```bash
yo codedesignplus:microservice microservice \
    --organization acme \
    --microservice inventory \
    --description "Microservice to manage product inventory." \
    --contact-name "John Smith" \
    --contact-email "john.smith@example.com" \
    --vault vault-acme \
    --aggregate product \
    --enable-grpc \
    --enable-async-worker \
    --consumer-name orderCreated \
    --consumer-aggregate order \
    --consumer-action update-stock \
    --domain-events "ProductCreated,ProductUpdated,ProductRemoved" \
    --entities Product,Category \
    --commands CreateProduct,UpdateProduct,RemoveProduct \
    --queries FindProductById,FindProductsByCategory
```

**Note:** The flags `--organization`, `--microservice`, `--description`, `--contact-name`, `--contact-email`, and `--vault` are optional after the initial creation, as they are stored in `archetype.json`.

### 2. Creating an Aggregate: Organizing Your Domain!

`yo codedesignplus:microservice aggregate`

Creates a new aggregate in your microservice. Aggregates are key in DDD—they maintain the consistency of your entities!

```bash
yo codedesignplus:microservice aggregate \
    --organization acme \
    --microservice users \
    --aggregate UserProfile
```

### 3. Creating an Entity: Giving Identity to Your Objects!

`yo codedesignplus:microservice entity`

Creates one or more entities. These are objects with identity that can change state!

```bash
yo codedesignplus:microservice entity \
    --organization acme \
    --microservice inventory \
    --entities Product,Category
```

### 4. Creating a Value Object: Objects Without Identity!

`yo codedesignplus:microservice valueObject`

Creates one or more value objects. They are immutable and defined by their attributes!

```bash
yo codedesignplus:microservice valueObject \
    --organization acme \
    --microservice users \
    --valueObjects Email,Address
```

### 5. Creating a Domain Event: Communicating What Happens!

`yo codedesignplus:microservice domainEvent`

Creates one or more domain events. These are representations of something that happened in your domain!

```bash
yo codedesignplus:microservice domainEvent \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --domainEvents OrderCreated,OrderShipped
```

### 6. Creating a Repository: Access to Your Data!

`yo codedesignplus:microservice repository`

Creates a repository for a specific aggregate. It's the interface to access persistent data!

```bash
yo codedesignplus:microservice repository \
    --organization acme \
    --microservice products \
    --repository Product
```

### 7. Creating a Controller: Managing Requests!

`yo codedesignplus:microservice controller`

Creates a controller to manage incoming requests (HTTP or gRPC).

```bash
yo codedesignplus:microservice controller \
    --organization acme \
    --microservice users \
    --controller UserProfileController
```

### 8. Creating a Proto: Defining Your gRPC API!

`yo codedesignplus:microservice proto`

Creates a `.proto` file for a gRPC service. It defines the messages and services for communication!

```bash
yo codedesignplus:microservice proto \
    --organization acme \
    --microservice products \
    --proto-name ProductService
```

### 9. Creating an Event Consumer: Reacting to Changes!

`yo codedesignplus:microservice consumer`

Creates a consumer that reacts to events published by other microservices.

```bash
yo codedesignplus:microservice consumer \
    --organization acme \
    --microservice notifications \
    --consumer-name OrderCreated \
    --consumer-aggregate Order \
    --consumer-action send-order-confirmation
```

### 10. Creating a Query: Getting Information Without Changing Anything!

`yo codedesignplus:microservice query`

Creates one or more queries to get information from the system without modifying its state!

```bash
yo codedesignplus:microservice query \
    --organization acme \
    --microservice products \
    --aggregate Product \
    --repository Product \
    --queries FindProductById,FindProductsByName
```

### 11. Creating a Command: Changing the System State!

`yo codedesignplus:microservice command`

Creates one or more commands to perform actions that change the system's state.

```bash
yo codedesignplus:microservice command \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --repository Order \
    --commands CreateOrder,CancelOrder
```

### 12. Creating Data Transfer Objects (DTOs): The Traveling Data!

`yo codedesignplus:microservice dto`

Creates one or more DTOs to transfer data between layers or microservices.

```bash
yo codedesignplus:microservice dto \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --dataTransferObject OrderDto,OrderSummaryDto
```

### 13. Creating a gRPC Project: Adding Fast Communication!

`yo codedesignplus:microservice grpc`

Creates a gRPC project within your microservice if you didn't do it initially!

```bash
yo codedesignplus:microservice grpc \
    --organization acme \
    --microservice products
```

### 14. Creating an Async Worker Project: Background Tasks!

`yo codedesignplus:microservice asyncWorker`

Creates an asynchronous worker project within your microservice for tasks that don't need to wait!

```bash
yo codedesignplus:microservice asyncWorker \
    --organization acme \
    --microservice notifications
```

## Internal Structure of the Generator and Contributions 🤝

### How Does This Generator Work Internally? 🤔

The `generator-codedesignplus` is built using Yeoman, a tool for creating code generators. Here's a summary of its structure:

1.  **Entry Point (`index.mjs`):**
    *   The "brain" of the generator.
    *   Imports the `Core`, `Utils`, and `DotNet` classes from their respective files.
    *   Retrieves command-line arguments (template, organization, microservice, etc.).
    *   Executes methods to generate files, depending on the resource (aggregate, command, entity, etc.).

2.  **`Core` Class (`core/core.mjs`):**
    *   Manages arguments, options, and initial questions.
    *   Maps generators to resources (aggregate, command, entity, etc.).
    *   Displays help in the console.
    *   Decides which generator to use, based on the template option.

3.  **`Utils` Class (`core/utils.mjs`):**
    *   Utility functions for the generator.
    *   Reads and writes configuration information (`archetype.json`).
    *   Transforms files (replaces names, namespaces, etc.).
    *   Manages namespaces, adds `usings`, and generates files with `generateFiles`.

4.  **`DotNet` Class (`core/dotnet.mjs`):**
    *   Logic to perform operations related to .NET.
    *   Removes projects from a microservice (executed when creating the microservice).

5.  **Specific Generators (`core/*.mjs`):**
    *   Generators for components (e.g., `aggregate.mjs`, `command.mjs`).
    *   Define specific arguments and options.
    *   Implement logic to generate files (using templates and `Utils`).

6.  **Templates (`templates/`):**
    *   Base files for generating code.
    *   Placeholders (e.g., `CodeDesignPlus.Net.Microservice`, `Order`) are dynamically replaced.
    *   The structure reflects a .NET project with the `CodeDesignPlus.Net.Microservice` archetype.

7. **Types (`types/`):**
   *  Definitions of classes/interfaces for data type management within the generator.

8.  **`package.json`:**
    *   Project dependencies, development scripts, and package information.
    *   Includes `yeoman-generator`, `find-up`, etc.

### How to Contribute to Development? 🤝

We love collaboration! If you want to contribute, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/codedesignplus/generator-codedesignplus.git
    cd generator-codedesignplus
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Make your changes:**
    *   Create a separate branch.
    *   Modify files in `generators`, `templates`, and `types`.
    *   Understand the logic (`index.mjs`, `core/core.mjs`, `core/utils.mjs`).
    *   If you add templates, update the generators' logic.

4.  **Run tests:**
    *   Run tests with `npm test`.
    *   Create or modify tests as needed.

5. **Ensure your code follows project style:**
    * Execute `npm run lint`, `npm run format` or `npm run prettier`

6.  **Create a Pull Request:**
    *   Upload your changes to your fork.
    *   Create a pull request to the `main` branch.
    *   Describe your changes clearly.

### Detailed File Structure 📁

Here's a summary of the generator's file structure:

```
generator-codedesignplus/
├── generators/                   # Generator logic
│   ├── core/                     # Central logic
│   │   ├── aggregate.mjs         # Aggregate generator
│   │   ├── appsettings.mjs        # Appsettings generator
│   │   ├── asyncWorker.mjs      # Async Worker generator
│   │   ├── command.mjs           # Command generator
│   │   ├── consumer.mjs        # Consumer generator
│   │   ├── controller.mjs        # Controller generator
│   │   ├── core.mjs              # Core class
│   │   ├── dataTransferObject.mjs # DTO generator
│   │   ├── domainEvent.mjs       # Domain event generator
│   │   ├── dotnet.mjs            # Utilities for .Net
│   │   ├── entity.mjs            # Entity generator
│   │   ├── errors.mjs             # Errors generator
│   │   ├── grpc.mjs               # gRPC generator
│   │   ├── microservice.mjs       # Microservice generator
│   │   ├── proto.mjs             # .proto file generator
│   │   ├── query.mjs             # Query generator
│   │   ├── repository.mjs        # Repository generator
│   │   ├── utils.mjs             # Utilities class
│   │   ├── valueObject.mjs       # Value object generator
│   │   └── xml.mjs               # XML Utilities
│   ├── index.mjs                # Entry point
│   ├── templates/               # File templates
│   │   ├── aggregate/           # Aggregate templates
│   │   ├── command/             # Command templates
│   │   ├── consumer/             # Consumer templates
│   │   ├── controller/          # Controller templates
│   │   ├── data-transfer-object/ # DTO templates
│   │   ├── domain-event/        # Domain event templates
│   │   ├── entity/              # Entity templates
│   │   ├── errors/              # Errors templates
│   │   ├── grpc/               # gRPC templates
│   │   ├── microservice/        # Microservice templates
│   │   ├── others/              # Other templates
│   │   ├── query/               # Query templates
│   │   ├── repository/          # Repository templates
│   │   └── value-object/        # Value object templates
│   └── types/               # Type definitions
│       ├── aggregate.mjs
│       ├── appsettings.mjs
│       ├── base.mjs
│       ├── command.mjs
│       ├── consumer.mjs
│       ├── controller.mjs
│       ├── dataTransferObject.mjs
│       ├── domainEvents.mjs
│       ├── entity.mjs
│       ├── index.mjs
│       ├── proto.mjs
│       ├── query.mjs
│       ├── repository.mjs
│       └── valueObject.mjs
├── package.json                # Project configuration
└── README.md                   # This file
```

## Usage 🚀

1.  **Install Yeoman and the generator:**

    ```bash
    npm install -g yo
    npm install -g generator-codedesignplus
    ```

2.  **Run the commands:**

    Go to the folder where you want to generate the microservice and run one of the `yo codedesignplus:microservice` commands shown above.

And that's it! We hope this generator is a great help to you on your journey as a microservice developer. If you have any questions, don't hesitate to contact us or create an issue in the repository! 😊
