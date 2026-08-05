# DTO是什么？

**前端传来的数据被封装成 DTO（`@RequestBody` 接收），在业务逻辑层（Service）里，我们会将 DTO 里的数据提取出来，转换（赋值）给 Entity 实体类，最后再把这个 Entity 塞进数据库。**

因为 DTO 是为了“满足前端展示或接口需求”设计的，而 Entity 是为了“完全贴合数据库表结构”设计的，所以**这两个类的数据字段通常是“对不齐”的**（比如名字不同、类型不同，或者 Entity 里多了创建时间、主键 ID，而 DTO 里没有）。

面对这种“对不齐”的情况，大家在实际开发中通常有以下三种做法：

### 1. 最原始也最稳妥：纯手工 Getter/Setter

这是最直接的办法。缺什么补什么，名字对不上就手动对应。

Java

```
public void saveUser(UserDTO dto) {
    UserEntity entity = new UserEntity();
    
    // 字段名一样的，直接 get/set
    entity.setUsername(dto.getUsername());
    
    // 字段名对不齐的，手动映射（比如 DTO 叫 pwd，数据库叫 password）
    entity.setPassword(dto.getPwd()); 
    
    // DTO 里没有，但数据库必须有的字段，手动生成或赋默认值
    entity.setCreateTime(new Date()); 
    entity.setDelFlag(0);
    
    // 最后存入数据库
    userMapper.insert(entity);
}
```

**优点**：运行速度最快，排查 Bug 最容易（哪里没赋上值一目了然）。

**缺点**：如果字段有几十个，代码会写得非常长，俗称“体力活”。

### 2. 半自动：使用 `BeanUtils` 拷贝工具

在 Java 中，大家经常会用 Spring 提供的 `BeanUtils.copyProperties()` 或者 Hutool 工具包里的 `BeanUtil`。

它的逻辑是：**只要 DTO 和 Entity 中名字和类型一模一样的字段，它就帮你自动拷贝过去。对不齐的字段，它直接忽略。**

Java

```
public void saveUser(UserDTO dto) {
    UserEntity entity = new UserEntity();
    
    // 一行代码，把所有名字、类型相同的字段全拷过去
    BeanUtils.copyProperties(dto, entity); 
    
    // 剩下的那些“对不齐”的、被忽略的字段，再手动补上
    entity.setPassword(dto.getPwd());
    entity.setCreateTime(new Date());
    
    userMapper.insert(entity);
}
```

**优点**：省去了大量重复的 getter/setter 代码。

**缺点**：底层使用了反射，性能稍微有一丁点损耗（但在大多数业务里可忽略不计）。

### 3. 行业主流高阶玩法：使用 MapStruct 框架

如果你在做正规的企业级开发，大家现在最喜欢用的是 **MapStruct**。

它和 Lombok 的原理类似，不需要你手写转换逻辑，只要写一个接口并加上注解告诉它“谁对应谁”，它在编译代码的时候，就会**自动帮你生成全套的 Getter/Setter 转换代码**。

Java

```
@Mapper(componentModel = "spring")
public interface UserConvert {
    
    // 告诉框架：把 DTO 里的 pwd 塞进 Entity 里的 password 字段
    @Mapping(source = "pwd", target = "password")
    // 忽略某些不需要拷贝的字段
    @Mapping(target = "createTime", ignore = true) 
    UserEntity dtoToEntity(UserDTO dto);
}
```

使用的时候极其优雅：

Java

```
public void saveUser(UserDTO dto) {
    // 直接调用转换器，拿到 Entity
    UserEntity entity = userConvert.dtoToEntity(dto);
    
    // 补充一些业务默认值
    entity.setCreateTime(new Date());
    
    userMapper.insert(entity);
}
```

**优点**：兼顾了代码的清爽（不用写一堆 set）和运行性能（底层其实还是帮你生成了原始的 get/set 代码，没有反射的性能损耗）。

### 总结

简单来说：

- 如果只有几个字段对不齐，大家通常是 **`BeanUtils` 拷贝 + 手动 set 补齐**。
    
- 如果项目极大，各种 DTO 和 Entity 互相转，大家会引入 **MapStruct** 这种专业工具来管理映射规则。