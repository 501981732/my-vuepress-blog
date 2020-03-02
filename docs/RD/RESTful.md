## RESTful:一种软件架构模式  面向资源

> 规范定义了资源的通用访问格式，虽然它不是一个强制要求，但遵守该规范可以让人易于理解

例如，商品Product就是一种资源。获取所有Product的URL如下：

```
GET /api/products
```

而获取某个指定的Product，例如，id为123的Product，其URL如下：

```
GET /api/products/123
```
新建一个Product使用POST请求，JSON数据包含在body中，URL如下：

```
POST /api/products
```

更新一个Product使用PUT请求，例如，更新id为123的Product，其URL如下：

```
PUT /api/products/123
```
删除一个Product使用DELETE请求，例如，删除id为123的Product，其URL如下：

```
DELETE /api/products/123
```


注意

1. **协议**

    - API与用户的通信协议，总是使用HTTPs协议
2. **域名**

    - 应该尽量将API部署在专用域名之下。
    - 或API很简单，不会有进一步扩展，可以考虑放在主域名下。
  
    ```
    https://api.example.com
    https://example.org/api/
    ```
3. **版本**
   
    - 应该将API的版本号放入URL。或者放到头信息
    
    ```
    https://api.example.com/v1/
    ```

4. **路径**
   
    - 路径又称"终点"（endpoint），表示API的具体网址。

    - 在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有**名词**，而且所用的名词往往与**数据库的表格名对应**。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。
  
    ```
    https://api.example.com/v1/zoos
    https://api.example.com/v1/animals
    https://api.example.com/v1/employees
    ```

5. **HTTP动词**

    ```
    GET（SELECT）：从服务器取出资源（一项或多项）。
    POST（CREATE）：在服务器新建一个资源。
    PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
    PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
    DELETE（DELETE）：从服务器删除资源。

    HEAD：获取资源的元数据。
    OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。
    ```

    ```
    GET /zoos：列出所有动物园
    POST /zoos：新建一个动物园
    GET /zoos/ID：获取某个指定动物园的信息
    PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
    PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
    DELETE /zoos/ID：删除某个动物园
    GET /zoos/ID/animals：列出某个指定动物园的所有动物
    DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
    
    ```
6. **过滤信息**
    
    ```
    ?limit=10：指定返回记录的数量
    ?offset=10：指定返回记录的开始位置。
    ?page=2&per_page=100：指定第几页，以及每页的记录数。
    ```
7. **状态码**

```
200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
204 NO CONTENT - [DELETE]：用户删除数据成功。
400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
```

8. **错误**

    - 如果状态码是4xx，就应该向用户返回出错信息。一般来说，返回的信息中将error作为键名，出错信息作为键值即可。

    ```
    {
        error: "Invalid API key"
    }
    ```
9. **返回结果**

    ```
    GET /collection：返回资源对象的列表（数组）
    GET /collection/resource：返回单个资源对象
    POST /collection：返回新生成的资源对象
    PUT /collection/resource：返回完整的资源对象
    PATCH /collection/resource：返回完整的资源对象
    DELETE /collection/resource：返回一个空文档
    ```
10. **Hypermedia API**
    - RESTful API最好做到Hypermedia，即返回结果中提供链接，连向其他API方法，使得用户不查文档，也知道下一步应该做什么。
    
    ```
    github 的api
    访问api.github.com会得到一个所有可用API的网址列表。
    {
  "current_user_url": "https://api.github.com/user",
  "authorizations_url": "https://api.github.com/authorizations",
  // ...
}
    ```