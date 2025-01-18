# generator-codedesignplus: Generador de Microservicios con Arquetipo CodeDesignPlus.Net.Microservice

Este generador de Yeoman tiene como objetivo simplificar y estandarizar la creación de microservicios basados en el arquetipo `CodeDesignPlus.Net.Microservice`. Proporciona comandos para generar diferentes componentes clave de un microservicio, siguiendo los principios del diseño basado en el dominio (DDD) y los patrones de arquitectura comúnmente utilizados en la construcción de microservicios.

## ¿Qué es CodeDesignPlus.Net.Microservice?

El arquetipo `CodeDesignPlus.Net.Microservice` es un punto de partida para la construcción de microservicios .NET modernos. Promueve la separación de responsabilidades, la mantenibilidad y la escalabilidad. Incluye una estructura de proyecto bien definida, configuraciones predeterminadas y bibliotecas de utilidad, permitiendo a los desarrolladores centrarse en la lógica de negocio. Este arquetipo ofrece una base sólida que incorpora buenas prácticas y facilita el desarrollo rápido de microservicios robustos.

## Conceptos Clave del Diseño Basado en el Dominio (DDD)

Antes de comenzar, es importante entender algunos conceptos fundamentales de DDD:

*   **Dominio:** El área de conocimiento sobre la cual opera el software. Representa el contexto del negocio y sus reglas. En un sistema de e-commerce, el dominio podría ser "la gestión de pedidos" o "la administración de productos".
*   **Agregado (Aggregate):** Un clúster de entidades que se tratan como una unidad, con una entidad raíz que actúa como punto de acceso. Los agregados son responsables de mantener la consistencia dentro de sus límites. Un ejemplo es un pedido (orden) con sus líneas de pedido, donde la entidad raíz es el pedido.
*   **Entidad (Entity):** Un objeto con identidad propia, que persiste a través del tiempo y tiene un ciclo de vida definido. Cada entidad tiene un identificador único. En una aplicación de gestión de usuarios, la entidad "Usuario" tendría propiedades como nombre, email, etc.
*   **Objeto de Valor (Value Object):** Un objeto sin identidad propia, definido por sus atributos. Los objetos de valor son inmutables y se comparan por valor. Ejemplos incluyen un objeto "Dirección" o un objeto "Moneda".
*   **Evento de Dominio (Domain Event):** Una notificación de algo que ha sucedido en el dominio. Los eventos son inmutables y representan hechos históricos. Un ejemplo podría ser "PedidoCreado" o "UsuarioRegistrado".
*   **Repositorio (Repository):** Un mecanismo para abstraer el acceso a los datos persistentes. Proporciona una interfaz para interactuar con el almacenamiento de datos, permitiendo a la aplicación trabajar con objetos de dominio sin preocuparse por los detalles de la base de datos.
*   **Comando (Command):** Una intención de realizar una acción que cambia el estado del sistema. Los comandos suelen ser iniciados por el usuario o por otros servicios. Ejemplos son "CrearPedido", "ActualizarUsuario".
*   **Query (Consulta):** Una solicitud para obtener información del sistema, sin modificar el estado. Ejemplos son "ObtenerUsuarioPorId" o "BuscarProductosPorNombre".

**Flags de Configuración**

| Flag                       | Descripción                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--organization`           | El nombre de la organización. Se utiliza para la organización del código y la gestión de los namespaces.                     |
| `--microservice`           | El nombre del microservicio.                                                                                               |
| `--description`            | Una descripción detallada del microservicio que proporciona un contexto claro sobre su propósito.                          |
| `--contact-name`           | Nombre de la persona de contacto responsable del microservicio.                                                             |
| `--contact-email`          | Email de contacto de la persona responsable.                                                                                 |
| `--vault`                  | El nombre del vault para la gestión de secretos y configuraciones.                                                           |
| `--is-crud`                | Indica que el microservicio será un CRUD, generando la estructura básica para operaciones de gestión de datos.               |
| `--aggregate`              | El nombre del agregado raíz del microservicio, esencial para la organización del dominio.                                   |
| `--enable-grpc`            | Habilita la API gRPC para el microservicio, que ofrece un protocolo de comunicación de alto rendimiento.                      |
| `--enable-async-worker`    | Habilita un worker asíncrono para el manejo de eventos y tareas en segundo plano, mejorando la escalabilidad.              |
| `--consumer-name`          | Nombre del consumer de eventos, especificando el tipo de evento que consume.                                                 |
| `--consumer-aggregate`     | Agregado al que pertenece el consumer, lo cual define el contexto del evento.                                                |
| `--consumer-action`        | Acción a realizar en el consumer cuando recibe un evento.                                                                    |
| `--domain-events`          | Lista de eventos de dominio separados por comas, fundamentales en la comunicación asíncrona entre microservicios.           |
| `--entities`               | Lista de entidades separadas por comas.                                                                                     |
| `--commands`               | Lista de comandos separados por comas, que representan las acciones del usuario o del sistema.                               |
| `--queries`                | Lista de queries separados por comas, que representan las solicitudes de información al sistema.                             |
| `--repository`             | El nombre del agregado para el cual se crea o consulta el repositorio.                                                      |
| `--controller`             | El nombre del controlador.                                                                                                 |
| `--proto-name`             | El nombre base del archivo `.proto`.                                                                                        |
| `--valueObjects`           | Lista de nombres de value objects separados por comas.                                                                    |
| `--dataTransferObject`     | Lista de nombres de DTOs separados por comas.                                                                        |

**Comandos Disponibles**

| Comando                                   | Descripción                                                                                                                                     | Opciones Principales                                                                                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yo codedesignplus:microservice microservice` | Crea la estructura base de un nuevo microservicio. Permite elegir entre un microservicio CRUD o uno custom, cada uno con patrones específicos. | `--organization`, `--microservice`, `--description`, `--contact-name`, `--contact-email`, `--vault`, `--is-crud`, `--aggregate`, `--enable-grpc`, `--enable-async-worker`, `--consumer-name`, `--consumer-aggregate`, `--consumer-action`, `--domain-events`, `--entities`, `--commands`, `--queries` |
| `yo codedesignplus:microservice aggregate`   | Crea un nuevo agregado dentro de un microservicio existente.                                                                                          | `--organization`, `--microservice`, `--aggregate`                                                                                                                                     |
| `yo codedesignplus:microservice entity`      | Crea una o más entidades.                                                                                                                        | `--organization`, `--microservice`, `--entities`                                                                                                                                         |
| `yo codedesignplus:microservice valueObject` | Crea uno o más value objects.                                                                                                                  | `--organization`, `--microservice`, `--valueObjects`                                                                                                                                    |
| `yo codedesignplus:microservice domainEvent`| Crea uno o más eventos de dominio asociados a un agregado.                                                                                        | `--organization`, `--microservice`, `--aggregate`, `--domainEvents`                                                                                                                       |
| `yo codedesignplus:microservice repository`  | Crea un repositorio para un agregado específico.                                                                                               | `--organization`, `--microservice`, `--repository`                                                                                                                                        |
| `yo codedesignplus:microservice controller`  | Crea un controlador para manejar las peticiones entrantes.                                                                                       | `--organization`, `--microservice`, `--controller`                                                                                                                                      |
| `yo codedesignplus:microservice proto`      | Crea un archivo `.proto` para un servicio gRPC.                                                                                                   | `--organization`, `--microservice`, `--proto-name`                                                                                                                                      |
| `yo codedesignplus:microservice consumer`   | Crea un consumer que reacciona a eventos de dominio.                                                                                            | `--organization`, `--microservice`, `--consumer-name`, `--consumer-aggregate`, `--consumer-action`                                                                                               |
| `yo codedesignplus:microservice query`       | Crea una o más consultas (queries) para obtener datos sin modificar el estado.                                                                      | `--organization`, `--microservice`, `--aggregate`, `--repository`, `--queries`                                                                                                              |
| `yo codedesignplus:microservice command`     | Crea uno o más comandos para realizar acciones que cambian el estado del sistema.                                                               | `--organization`, `--microservice`, `--aggregate`, `--repository`, `--commands`                                                                                                           |
| `yo codedesignplus:microservice dto`         | Crea uno o más Data Transfer Objects (DTOs) para transferir datos.                                                                               | `--organization`, `--microservice`, `--aggregate`, `--dataTransferObject`                                                                                                        |
| `yo codedesignplus:microservice grpc`       | Crea un proyecto gRPC.                                                                                                                           | `--organization`, `--microservice`                                                                                                                                                  |
| `yo codedesignplus:microservice asyncWorker`| Crea un proyecto de worker asíncrono.                                                                                                          | `--organization`, `--microservice`                                                                                                                                                  |

### 1. Creación de Microservicio

`yo codedesignplus:microservice microservice`

Este comando es el punto de partida para generar la estructura de un nuevo microservicio. Puedes optar por un microservicio **CRUD** o uno **Custom**, cada uno con sus propias características y patrones de diseño, para adaptarse mejor a las necesidades de tu proyecto.

#### Microservicio CRUD

Un microservicio CRUD (Create, Read, Update, Delete) se centra en la gestión de datos. Es adecuado para escenarios donde las operaciones principales son crear, leer, actualizar y eliminar entidades. Se enfoca principalmente en la persistencia de datos.

```bash
yo codedesignplus:microservice microservice \
    --organization acme \
    --microservice users \
    --description "Microservicio para gestionar usuarios de la plataforma." \
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
**Nota:** El entrypoint REST se crea por defecto al crear un microservicio.

#### Microservicio Custom

Un microservicio custom se enfoca en la lógica de negocio compleja y eventos, en lugar de simples operaciones CRUD. Es ideal para escenarios donde el flujo de trabajo es más importante que el almacenamiento de datos, permitiendo mayor flexibilidad y personalización.

```bash
yo codedesignplus:microservice microservice \
    --organization acme \
    --microservice inventory \
    --description "Microservicio para gestionar el inventario de productos." \
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

**Nota:** Los flags `--organization`, `--microservice`, `--description`, `--contact-name`, `--contact-email`, y `--vault` son opcionales después de la creación inicial del microservicio, ya que se almacenan en el archivo `archetype.json`.

### 2. Creación de un Agregado

`yo codedesignplus:microservice aggregate`

Crea un nuevo agregado en el microservicio. Los agregados son bloques de construcción clave en DDD, que garantizan la consistencia de las entidades dentro de sus límites.

```bash
yo codedesignplus:microservice aggregate \
    --organization acme \
    --microservice users \
    --aggregate UserProfile
```

### 3. Creación de Entidad

`yo codedesignplus:microservice entity`

Crea una o más entidades. Las entidades son objetos con identidad que pueden cambiar de estado a lo largo de su ciclo de vida.

```bash
yo codedesignplus:microservice entity \
    --organization acme \
    --microservice inventory \
    --entities Product,Category
```

### 4. Creación de Value Object

`yo codedesignplus:microservice valueObject`

Crea uno o más objetos de valor. Estos son objetos inmutables definidos por sus atributos y no tienen identidad propia.

```bash
yo codedesignplus:microservice valueObject \
    --organization acme \
    --microservice users \
    --valueObjects Email,Address
```

### 5. Creación de Evento de Dominio

`yo codedesignplus:microservice domainEvent`

Crea uno o más eventos de dominio, que son representaciones de algo que ha ocurrido en el dominio.

```bash
yo codedesignplus:microservice domainEvent \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --domainEvents OrderCreated,OrderShipped
```

### 6. Creación de Repositorio

`yo codedesignplus:microservice repository`

Crea un repositorio para un agregado específico, proporcionando una interfaz para acceder a los datos persistentes del agregado.

```bash
yo codedesignplus:microservice repository \
    --organization acme \
    --microservice products \
    --repository Product
```

### 7. Creación de Controlador

`yo codedesignplus:microservice controller`

Crea un controlador que gestiona las peticiones entrantes (HTTP o gRPC) para el microservicio.

```bash
yo codedesignplus:microservice controller \
    --organization acme \
    --microservice users \
    --controller UserProfileController
```

### 8. Creación de Proto

`yo codedesignplus:microservice proto`

Crea un archivo `.proto` para un servicio gRPC, que define los mensajes y servicios para la comunicación.

```bash
yo codedesignplus:microservice proto \
    --organization acme \
    --microservice products \
    --proto-name ProductService
```

### 9. Creación de Consumer de Eventos

`yo codedesignplus:microservice consumer`

Crea un consumer que reacciona a eventos publicados por otros microservicios, realizando una acción específica.

```bash
yo codedesignplus:microservice consumer \
    --organization acme \
    --microservice notifications \
    --consumer-name OrderCreated \
    --consumer-aggregate Order \
    --consumer-action send-order-confirmation
```

### 10. Creación de Query

`yo codedesignplus:microservice query`

Crea una o más queries para obtener información del sistema, sin modificar su estado.

```bash
yo codedesignplus:microservice query \
    --organization acme \
    --microservice products \
    --aggregate Product \
    --repository Product \
    --queries FindProductById,FindProductsByName
```

### 11. Creación de Comando

`yo codedesignplus:microservice command`

Crea uno o más comandos para realizar acciones que cambian el estado del sistema.

```bash
yo codedesignplus:microservice command \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --repository Order \
    --commands CreateOrder,CancelOrder
```

### 12. Creación de Data Transfer Objects (DTOs)

`yo codedesignplus:microservice dto`

Crea uno o más Data Transfer Objects (DTOs) para transferir datos entre capas o microservicios, permitiendo definir la forma de los datos según las necesidades del consumidor.

```bash
yo codedesignplus:microservice dto \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --dataTransferObject OrderDto,OrderSummaryDto
```

### 13. Creación de Proyecto gRPC

`yo codedesignplus:microservice grpc`

Crea un proyecto gRPC dentro de la estructura de un microservicio existente, en caso de que no se haya creado inicialmente.

```bash
yo codedesignplus:microservice grpc \
    --organization acme \
    --microservice products
```

### 14. Creación de Proyecto Async Worker

`yo codedesignplus:microservice asyncWorker`

Crea un proyecto de worker asíncrono dentro de la estructura de un microservicio existente, en caso de que no se haya creado inicialmente.

```bash
yo codedesignplus:microservice asyncWorker \
    --organization acme \
    --microservice notifications
```
## Uso

1.  **Instala Yeoman y el generador:**

    ```bash
    npm install -g yo
    npm install -g generator-codedesignplus
    ```

2.  **Ejecuta los comandos:**

    Ve a la carpeta donde quieres generar el microservicio y ejecuta uno de los comandos de `yo codedesignplus:microservice` detallados anteriormente.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras errores o quieres añadir nuevas funcionalidades, por favor crea un Pull Request en el repositorio del generador.