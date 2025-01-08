# generator-codedesignplus: Generador de Microservicios con Arquetipo CodeDesignPlus.Net.Microservice

Este generador de Yeoman tiene como objetivo simplificar y estandarizar la creación de microservicios basados en el arquetipo `CodeDesignPlus.Net.Microservice`. Proporciona comandos para generar diferentes componentes clave de un microservicio, siguiendo los principios del diseño basado en el dominio (DDD) y los patrones de arquitectura comúnmente utilizados en la construcción de microservicios.

## ¿Qué es CodeDesignPlus.Net.Microservice?

El arquetipo `CodeDesignPlus.Net.Microservice` es un punto de partida para la construcción de microservicios .NET modernos. Promueve la separación de responsabilidades, la mantenibilidad y la escalabilidad. Incluye una estructura de proyecto bien definida, configuraciones predeterminadas y bibliotecas de utilidad, permitiendo a los desarrolladores centrarse en la lógica de negocio.

## Conceptos Clave del Diseño Basado en el Dominio (DDD)

Antes de comenzar, es importante entender algunos conceptos fundamentales de DDD:

*   **Dominio:** El área de conocimiento sobre la cual opera el software.
*   **Agregado (Aggregate):** Un clúster de entidades que se tratan como una unidad, con una entidad raíz que actúa como punto de acceso. Los agregados garantizan la consistencia dentro de sus límites.
*   **Entidad (Entity):** Un objeto con identidad propia, que persiste a través del tiempo y tiene un ciclo de vida definido.
*   **Objeto de Valor (Value Object):** Un objeto sin identidad propia, definido por sus atributos. Los objetos de valor son inmutables y se comparan por valor.
*   **Evento de Dominio (Domain Event):** Una notificación de algo que ha sucedido en el dominio. Los eventos son inmutables y representan hechos históricos.
*   **Repositorio (Repository):** Un mecanismo para abstraer el acceso a los datos persistentes. Proporciona una interfaz para interactuar con el almacenamiento de datos.
*   **Comando (Command):** Una intención de realizar una acción que cambia el estado del sistema.
*   **Query (Consulta):** Una solicitud para obtener información del sistema, sin modificar el estado.

## Comandos Disponibles

El generador `codedesignplus` ofrece los siguientes comandos para la creación de artefactos dentro de un microservicio:

### 1. `yo codedesignplus:microservice microservice` (Creación de Microservicio Base)

Este comando es el punto de partida para generar la estructura de un nuevo microservicio. Puedes optar por un microservicio **CRUD** o uno **No CRUD**, cada uno con sus propias características y patrones de diseño.

#### A. Microservicio CRUD

Un microservicio CRUD (Create, Read, Update, Delete) se centra en la gestión de datos. Es adecuado para escenarios donde las operaciones principales son crear, leer, actualizar y eliminar entidades.

**Ejemplo:**

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
    --enable-rest \
    --enable-grpc \
    --enable-async-worker \
    --consumer-name userRegistered \
    --consumer-aggregate user \
    --consumer-action send-welcome-email
```

*   **`--organization`**: El nombre de la organización (ej. `acme`).
*   **`--microservice`**: El nombre del microservicio (ej. `users`).
*   **`--description`**: Una descripción del microservicio.
*   **`--contact-name`**: Nombre de la persona de contacto.
*   **`--contact-email`**: Email de contacto.
*   **`--vault`**: El nombre del vault (ej. `vault-acme`).
*   **`--is-crud`**: Indica que el microservicio será un CRUD.
*   **`--aggregate`**: El nombre del agregado raíz del microservicio (ej. `user`).
*   **`--enable-rest`**: Habilita la API REST para el microservicio.
*   **`--enable-grpc`**: Habilita la API gRPC para el microservicio.
*   **`--enable-async-worker`**: Habilita un worker asíncrono para el manejo de eventos.
*   **`--consumer-name`**: Nombre del consumer de eventos (ej. `userRegistered`).
*   **`--consumer-aggregate`**: Agregado al que pertenece el consumer (ej. `user`).
*   **`--consumer-action`**: Acción a realizar en el consumer (ej. `send-welcome-email`).

**Patrones de Diseño:**

*   **Arquitectura de Microservicios:** Separa la aplicación en servicios independientes.
*   **Diseño Basado en el Dominio (DDD):** Organiza la lógica de negocio alrededor del dominio del problema, enfocándose en operaciones básicas de gestión de datos.

#### B. Microservicio No CRUD

Un microservicio No CRUD se enfoca en la lógica de negocio compleja y eventos, en lugar de simples operaciones CRUD. Es ideal para escenarios donde el flujo de trabajo es más importante que el almacenamiento de datos.

**Ejemplo:**

```bash
yo codedesignplus:microservice microservice \
    --organization acme \
    --microservice inventory \
    --description "Microservicio para gestionar el inventario de productos." \
    --contact-name "John Smith" \
    --contact-email "john.smith@example.com" \
    --vault vault-acme \
     --aggregate product \
    --enable-rest \
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

*   **`--organization`**: El nombre de la organización (ej. `acme`).
*   **`--microservice`**: El nombre del microservicio (ej. `inventory`).
*   **`--description`**: Una descripción del microservicio.
*   **`--contact-name`**: Nombre de la persona de contacto.
*   **`--contact-email`**: Email de contacto.
*   **`--vault`**: El nombre del vault (ej. `vault-acme`).
*   **`--aggregate`**: El nombre del agregado raíz del microservicio (ej. `product`).
 *   **`--enable-rest`**: Habilita la API REST para el microservicio.
*   **`--enable-grpc`**: Habilita la API gRPC para el microservicio.
*   **`--enable-async-worker`**: Habilita un worker asíncrono para el manejo de eventos.
*   **`--consumer-name`**: Nombre del consumer de eventos (ej. `orderCreated`).
*   **`--consumer-aggregate`**: Agregado al que pertenece el consumer (ej. `order`).
*   **`--consumer-action`**: Acción a realizar en el consumer (ej. `update-stock`).
*   **`--domain-events`**: Lista de eventos de dominio separados por comas (ej. `ProductCreated,ProductUpdated,ProductRemoved`).
*   **`--entities`**: Lista de entidades separadas por comas (ej. `Product,Category`).
*   **`--commands`**: Lista de comandos separados por comas (ej. `CreateProduct,UpdateProduct,RemoveProduct`).
*   **`--queries`**: Lista de queries separados por comas (ej. `FindProductById,FindProductsByCategory`).

**Patrones de Diseño:**

*   **Arquitectura de Microservicios:** Separa la aplicación en servicios independientes.
*   **Diseño Basado en el Dominio (DDD):** Organiza la lógica de negocio alrededor del dominio del problema, utilizando patrones como eventos, comandos y queries.
*   **CQRS (Command Query Responsibility Segregation):** Separa las operaciones de lectura y escritura.

### 2. `yo codedesignplus:microservice aggregate` (Creación de Agregado)

Crea un nuevo agregado en el microservicio. Los agregados son bloques de construcción clave en DDD, que garantizan la consistencia de las entidades dentro de sus límites.

**Ejemplo:**

```bash
yo codedesignplus:microservice aggregate \
    --organization acme \
    --microservice users \
    --aggregate UserProfile
```

*   **`--aggregate`**: El nombre del nuevo agregado (ej. `UserProfile`).

**Patrones de Diseño:**

*   **Diseño Basado en el Dominio (DDD):** Define el límite de consistencia y la unidad de transacción.

### 3. `yo codedesignplus:microservice entity` (Creación de Entidad)

Crea una o más entidades. Las entidades son objetos con identidad que pueden cambiar de estado a lo largo de su ciclo de vida.

**Ejemplo:**

```bash
yo codedesignplus:microservice entity \
    --organization acme \
    --microservice inventory \
    --entities Product,Category
```

*   **`--entities`**: Lista de nombres de entidades separadas por comas (ej. `Product,Category`).

**Patrones de Diseño:**

*   **Diseño Basado en el Dominio (DDD):** Representa los objetos clave del dominio con identidad propia.

### 4. `yo codedesignplus:microservice valueObject` (Creación de Value Object)

Crea uno o más objetos de valor. Estos son objetos inmutables definidos por sus atributos y no tienen identidad propia.

**Ejemplo:**

```bash
yo codedesignplus:microservice valueObject \
    --organization acme \
    --microservice users \
    --valueObjects Email,Address
```

*   **`--valueObjects`**: Lista de nombres de value objects separados por comas (ej. `Email,Address`).

**Patrones de Diseño:**

*   **Diseño Basado en el Dominio (DDD):** Representa conceptos del dominio definidos por valor, en lugar de identidad.

### 5. `yo codedesignplus:microservice domainEvent` (Creación de Evento de Dominio)

Crea uno o más eventos de dominio, que son representaciones de algo que ha ocurrido en el dominio.

**Ejemplo:**

```bash
yo codedesignplus:microservice domainEvent \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --domainEvents OrderCreated,OrderShipped
```

*   **`--domainEvents`**: Lista de nombres de eventos de dominio separados por comas (ej. `OrderCreated,OrderShipped`).
*   **`--aggregate`**: El nombre del agregado al que pertenecen los eventos (ej. `Order`).

**Patrones de Diseño:**

*   **Diseño Basado en el Dominio (DDD):** Captura la historia del dominio.
*   **Event-Driven Architecture (EDA):** Facilita la comunicación asíncrona entre servicios.

### 6. `yo codedesignplus:microservice repository` (Creación de Repositorio)

Crea un repositorio para un agregado específico, proporcionando una interfaz para acceder a los datos persistentes del agregado.

**Ejemplo:**

```bash
yo codedesignplus:microservice repository \
    --organization acme \
    --microservice products \
    --repository Product
```

*   **`--repository`**: El nombre del agregado para el cual se crea el repositorio (ej. `Product`).

**Patrones de Diseño:**

*   **Diseño Basado en el Dominio (DDD):** Separa la lógica de dominio de la persistencia.
*   **Repository Pattern:** Define una interfaz para acceder a la base de datos.

### 7. `yo codedesignplus:microservice controller` (Creación de Controlador)

Crea un controlador que gestiona las peticiones entrantes (HTTP o gRPC) para el microservicio.

**Ejemplo:**

```bash
yo codedesignplus:microservice controller \
    --organization acme \
    --microservice users \
    --controller UserProfileController
```

*   **`--controller`**: El nombre del controlador (ej. `UserProfileController`).

**Patrones de Diseño:**

*   **REST API:** Maneja las peticiones HTTP.
*   **gRPC:** Maneja las peticiones gRPC.

### 8. `yo codedesignplus:microservice proto` (Creación de Proto)

Crea un archivo .proto para un servicio gRPC, que define los mensajes y servicios para la comunicación.

**Ejemplo:**

```bash
yo codedesignplus:microservice proto \
    --organization acme \
    --microservice products \
    --proto-name ProductService
```

*   **`--proto-name`**: El nombre base del archivo .proto (ej. `ProductService`).

**Patrones de Diseño:**

*   **gRPC:** Define la interfaz de servicio.

### 9. `yo codedesignplus:microservice consumer` (Creación de Consumer de Eventos)

Crea un consumer que reacciona a eventos publicados por otros microservicios, realizando una acción específica.

**Ejemplo:**

```bash
yo codedesignplus:microservice consumer \
    --organization acme \
    --microservice notifications \
    --consumer-name OrderCreated \
    --consumer-aggregate Order \
    --consumer-action send-order-confirmation
```

*   **`--consumer-name`**: El nombre del evento a consumir (ej. `OrderCreated`).
*   **`--consumer-aggregate`**: El nombre del agregado al que pertenece el evento (ej. `Order`).
*   **`--consumer-action`**: La acción a realizar cuando se consume el evento (ej. `send-order-confirmation`).

**Patrones de Diseño:**

*   **Event-Driven Architecture (EDA):** Permite la comunicación asíncrona entre microservicios.

### 10. `yo codedesignplus:microservice query` (Creación de Query)

Crea una o más queries para obtener información del sistema, sin modificar su estado.

**Ejemplo:**

```bash
yo codedesignplus:microservice query \
    --organization acme \
    --microservice products \
    --aggregate Product \
    --repository Product \
    --queries FindProductById,FindProductsByName
```

*   **`--aggregate`**: El nombre del agregado al que pertenece la query (ej. `Product`).
*   **`--repository`**: El nombre del agregado para el cual se consulta el repositorio (ej. `Product`).
*   **`--queries`**: Lista de nombres de queries separados por comas (ej. `FindProductById,FindProductsByName`).

**Patrones de Diseño:**

*   **CQRS (Command Query Responsibility Segregation):** Separa las operaciones de lectura de las de escritura.

### 11. `yo codedesignplus:microservice command` (Creación de Comando)

Crea uno o más comandos para realizar acciones que cambian el estado del sistema.

**Ejemplo:**

```bash
yo codedesignplus:microservice command \
    --organization acme \
    --microservice orders \
    --aggregate Order \
    --repository Order \
    --commands CreateOrder,CancelOrder
```

*   **`--aggregate`**: El nombre del agregado al que pertenece el comando (ej. `Order`).
*   **`--repository`**: El nombre del agregado para el cual se realiza la operación en el repositorio (ej. `Order`).
*   **`--commands`**: Lista de nombres de comandos separados por comas (ej. `CreateOrder,CancelOrder`).

**Patrones de Diseño:**

*   **CQRS (Command Query Responsibility Segregation):** Separa las operaciones de escritura de las de lectura.

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

## Licencia

Este generador se distribuye bajo la Licencia MIT.
