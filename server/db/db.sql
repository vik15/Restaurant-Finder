create table restaurants(
id bigserial not null primary key,
name varchar(50) not null,
location varchar(50) not null,
price_range int not null check(price_range >= 1 and price_range <=5)
);
