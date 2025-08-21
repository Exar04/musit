DB models -
```sql
User{
    username String required,
    email String unique required
    password String required
    createdAt Date
}
```