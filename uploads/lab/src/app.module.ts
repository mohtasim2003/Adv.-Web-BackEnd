import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'airline-management-airline-management.l.aivencloud.com',
      port: 21496,
      username: 'avnadmin',
      password: 'AVNS_VAT7Jz1TUw_Ox5gDetD',
      database: 'defaultdb',
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUBy1cykI5TLnHuRR1Gm1l5/PE23YwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1MTZiNzU1OTItMjlhZC00YTYxLTkzN2EtZjg4NTY3M2Uz
YTI1IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMTExMTcwMjI0WhcNMzUxMTA5MTcw
MjI0WjBAMT4wPAYDVQQDDDUxNmI3NTU5Mi0yOWFkLTRhNjEtOTM3YS1mODg1Njcz
ZTNhMjUgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANvC0cOGd9m4k3KSPOs+8uBZ8oXWUSH3lH4dCUxDaz0eygIEn7Ihz052
rnNc5BszMEPdsLimtXPi+bW87wG+sAQDdtB22JkfE15zkxYkNjwpYs8lQroJdwNx
GElqACmirl/aWKrE45Onn7mtSVJH4JoZx1iSwbjFAfC22fidI8X/agz4JOUJlpEK
6SowXjK2BHSchhp/fBNPVkYJKliiw+cEDmZC1UilPVY4MbCbXEcm20rBSagNMnnl
RjyXF3hh8sTd1Ij9tDgivJILoISk38/nWVE7SlIKxiHeBe5yGz+q5MjAmiXCQhCX
EW1hH264jZEl++IH2GyCPX4mPk07T9ka1+ZsWcyq6E+THSonO3LcX6Xz9LCiQQPB
35Ai0RsIuuwTFq9VRt5rIqJ6Bdaf03DiHfRit+gR0tYYb+oaSdyF7HHnA1xpwe8C
CPfG0HYQIopPmFOJWJ9Lq91tyL53AY73eq1CjOhGvQ1iPnQDYpwVydibEckv7n4B
oH+RElDcDwIDAQABo0IwQDAdBgNVHQ4EFgQUMwxdDgxNHXznNy3IRRAe6TURV5gw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBADB+VxlWtLqbbQ/abzsfhVijcjWvy8OnQCgAgrNWPFZTxM2XOk9YzwHkDgFQ
YqWZ7ADeOFAPx90umASp11FVPh9i5ABsrV1HijYoDBwOSzXfhiSp6mEZvL4iYs7c
gfMF/GhJEmlWVadtYQHiAD1L80b0OeUU2JxEOJtWEO/8yWQ9qgDdI/EAW659czK9
ZfRijBrax6IKt/tRvOK2ltDoBsxJ6jdInW+CqaKzccW257ncEqcBl6aetpJGOb8h
MMgypjOMPJaMs2+s6FuHx81l7hd3EP/1UdPkUtoPQxeYLkTznT+7q8nnNKyJ7qpN
QGtt4NpTlvd8xBI/iNul6JpApCADj+VmCLblIF4DoiJvzPoVLP3FC8C8xSARft7s
U+lzVuOqR0t17YO7k6ZMubfBSCLqn6K63OBf1yJ1aYGbNDx4ePkGIzrN9IikaZsO
0VjfuBUTiB1Nw5LlhmtkEa0Gcx5OAHt97CRMRtSvTxUC+myBD1HOvLPthmPIKiwF
MHzOpA==
-----END CERTIFICATE-----`,
      },

      extra: {
        ssl: {
          rejectUnauthorized: true,
          ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUBy1cykI5TLnHuRR1Gm1l5/PE23YwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1MTZiNzU1OTItMjlhZC00YTYxLTkzN2EtZjg4NTY3M2Uz
YTI1IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMTExMTcwMjI0WhcNMzUxMTA5MTcw
MjI0WjBAMT4wPAYDVQQDDDUxNmI3NTU5Mi0yOWFkLTRhNjEtOTM3YS1mODg1Njcz
ZTNhMjUgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANvC0cOGd9m4k3KSPOs+8uBZ8oXWUSH3lH4dCUxDaz0eygIEn7Ihz052
rnNc5BszMEPdsLimtXPi+bW87wG+sAQDdtB22JkfE15zkxYkNjwpYs8lQroJdwNx
GElqACmirl/aWKrE45Onn7mtSVJH4JoZx1iSwbjFAfC22fidI8X/agz4JOUJlpEK
6SowXjK2BHSchhp/fBNPVkYJKliiw+cEDmZC1UilPVY4MbCbXEcm20rBSagNMnnl
RjyXF3hh8sTd1Ij9tDgivJILoISk38/nWVE7SlIKxiHeBe5yGz+q5MjAmiXCQhCX
EW1hH264jZEl++IH2GyCPX4mPk07T9ka1+ZsWcyq6E+THSonO3LcX6Xz9LCiQQPB
35Ai0RsIuuwTFq9VRt5rIqJ6Bdaf03DiHfRit+gR0tYYb+oaSdyF7HHnA1xpwe8C
CPfG0HYQIopPmFOJWJ9Lq91tyL53AY73eq1CjOhGvQ1iPnQDYpwVydibEckv7n4B
oH+RElDcDwIDAQABo0IwQDAdBgNVHQ4EFgQUMwxdDgxNHXznNy3IRRAe6TURV5gw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBADB+VxlWtLqbbQ/abzsfhVijcjWvy8OnQCgAgrNWPFZTxM2XOk9YzwHkDgFQ
YqWZ7ADeOFAPx90umASp11FVPh9i5ABsrV1HijYoDBwOSzXfhiSp6mEZvL4iYs7c
gfMF/GhJEmlWVadtYQHiAD1L80b0OeUU2JxEOJtWEO/8yWQ9qgDdI/EAW659czK9
ZfRijBrax6IKt/tRvOK2ltDoBsxJ6jdInW+CqaKzccW257ncEqcBl6aetpJGOb8h
MMgypjOMPJaMs2+s6FuHx81l7hd3EP/1UdPkUtoPQxeYLkTznT+7q8nnNKyJ7qpN
QGtt4NpTlvd8xBI/iNul6JpApCADj+VmCLblIF4DoiJvzPoVLP3FC8C8xSARft7s
U+lzVuOqR0t17YO7k6ZMubfBSCLqn6K63OBf1yJ1aYGbNDx4ePkGIzrN9IikaZsO
0VjfuBUTiB1Nw5LlhmtkEa0Gcx5OAHt97CRMRtSvTxUC+myBD1HOvLPthmPIKiwF
MHzOpA==
-----END CERTIFICATE-----`,
        },
      },
    }),
  


    DbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
