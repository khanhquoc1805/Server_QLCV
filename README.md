# HỆ THỐNG QUẢN LÝ CÔNG VĂN

## Yêu cầu

-   Yarn package manager
-   NodeJS v16.3.0
-   MySQL

## Hướng dẫn cài đặt

### Cài đặt cơ sở dữ liệu

-   Tạo một cơ sở dữ liệu với tên bất kì, sau đó import dữ liệu vào từ tập tin dump.

```sh
mysql -u USER_NAME DB_NAME -p < ./dump.sql
```

Trong đó,

-   USER_NAME: là tên người dùng của hệ quản trị cơ sở dữ liệu.
-   DB_NAME: là tên của cơ sở dữ liệu vừa tạo.

### Cài đặt máy chủ

-   Cài đặt các biến môi trường

Sao chép tập tin env_template thành .env và điền các giá trị tương ứng

| Tên biến    | Mô tả                   |
| ----------- | ----------------------------- |
| JWT_SECRET  | Mật khẩu dùng để mã hóa JWT   |
| CLOUD_NAME= | Tên của cloud trên Cloudinary |
| API_KEY=    | API key của Cloudinary        |
| API_SECRET= | API secret của Cloudinary     |

-   Cài đặt các thư viện

```sh
yarn
```

-   Khởi chạy máy chủ

```sh
yarn dev
```
