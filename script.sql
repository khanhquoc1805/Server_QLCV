
use quanlycongvan;


insert into socv values ("nd","Nghị Định","Sổ Văn Bản Đi","Phòng Kế Hoạch - Tổng Hợp");

select count(code) from myfulltext;
select * from myfulltext;


select * from myfulltext where text like "%Mental Center%";
select count(code) from myfulltext where text like "%Center%";

select * from cvdi where tenvbdi like "%Hospital%" and ttxuly="chuaxuly";
select count(mavbdi) from cvdi where tenvbdi like "%Central%";


delete from myfulltext where code!=0;


select * from noinhancvdi;
select * from cvdi limit 50000;



delete from nhanvien where manv!="00001";
delete from cvdi where mavbdi!=6;

select * from nhanvien;
select * from xuly;
select * from bophan;
select * from cvdi limit 50500;
select * from tt_bosung where matt=53776;
select * from noinhancvdi;
select * from xulycvdi;
select * from myfulltext;
select * from loaicv;
select * from linhvuc;
select * from linhvuc;
select * from cvden;
select * from nhapcvdi;
select * from nhapcvden;


alter table cvden modify soden varchar(32);


delete from noinhancvdi where mavbdi!=2;
delete from xulycvdi where mavbdi!=2;
delete from cvdi where mavbdi!=2;
delete from tt_bosung where matt!=1;


update cvden set xuly="chuaxuly" where macvden=7;

alter table nhanvien add column email varchar(128);
alter table tt_bosung add column noidung varchar(10000);


select * from xuly;

update cvdi set ttxuly = "hoanthanhxuly" where mavbdi=3667;

update nhanvien set madv = 3 where manv="canbo1";
update cvden set xuly="chuaxuly" where macvden = 1;
update xulycvdi set trangthai=null where manv="c0928";

update cvdi set ttxuly="hoanthanhxuly" where mavbdi=1;

delete from xuly where manv != "q";

update xuly set trangthai ="chuaxuly" where macvden=1;
update tt_bosung set dinhkem="https://doc-08-30-docs.googleusercontent.com/docs/securesc/v4epsnk7lejn7ls304gg5qajrvu1p7m5/qkghhadtsr48fqu4amg1pfghflhhdkea/1647333375000/08599017269250487586/08599017269250487586/1fwZjBQoRHQHN896UHIZfiGrJLDlIkjsI?e=download&ax=ACxEAsZO4vnAkw_xLcFI_jHfXv6-TReer4raHwhcjIppo4t2mjsS1z6BJgWgHAwnEY8ZxVaNpzi_lvJXzN2dW7GnPQXtIHlU6VZWz79sNZtbxovDQNpITLfwpYZ_ckuKrrF5bzzCNXrvBCnJOkfDHU8rLxzy63wAvauY9k_mPYo9JcwFcSZqNqEKR5OPC7zeaRDx9p8nx5La3SDRd_6Z4ONoVgtHd6qkfDZ2Xvw0c9RRw0a037cu4gWLlt1WMGTIKj8KAc191Bw9Gy2Yo1eCbZgAg1Siqp0JaGc-iLE2Fr4hVASVqVx62vcbDN_6H7tiB8mYEnbBnu9wODE-6kNCvVAXu56Bjk353g14nRWjoD8giwfdBtBTtgCgJVPMb5lQx6fhDWL-m9_LfXQpSWm0N_kekdkwBLtHXw_51QYVtgUV3leXhzIXbKcTBxlBqyC_6OHGS5B4HH8yL0cYF47W8jzJQL6CskyyP8YZMLYSEzITIB9aHqd1P-eZeHok2F7YWkJVnikg4NpRkhzAeYfGOneOZgjJA4q0BNd7BTISNZmHodnKzShNdlxRKED_Xmw8tv7OXqMCtJ5-KMGIwgQWQ_xxCgWpf-G2mRpv-0WwbGfBprhA-rDxBvLV68EmnYltjTncn0bqwo3Mt_5kbSrKP6ASmvWaup5A0QY2Kb-JwhsL&authuser=0&nonce=56f5prcla7hk8&user=08599017269250487586&hash=sbfq5o6us8ptpepd22gvciroknsuek01" where matt=45;

delete from tt_bosung where matt!=46;
delete from cvdi where mavbdi !=9;
delete from cvden where macvden !=111;

update nhanvien set matkhau = "$2y$10$f8ZNj4G97kgVp9t.Tt34D.hqePqZQGxLa0Tnv5JgoZFy6xIkNqq9K" where manv = "00004";



insert into bophan values("ql","Quản Lý");
insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp,email,madv) values("00001","Khánh Quốc","Quản Trị Hệ Thống","$2y$10$BOkz3s9agSLVm0Jw2yFj9eHqWC0AP.ChHWBDnIgLMIf1HLBER7qam","admin","ql","quocb1809283@student.ctu.edu.vn",2);

insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp) values("canbo1","Cán Bộ 1","Quản Trị Hệ Thống","$2a$12$z/1IWfmN/HzPgsz2U1LP1OYoX1avDSeWklf83rHVPaky//mKmhjUK","vanthu","ql");
insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp) values("canbo2","Cán Bộ 2","Quản Trị Hệ Thống","$2a$12$7IPrRR0TnN886WESk2hRKunDIizDUMKn02T13yMTMfcxnVRnBh6r2","vanthu","ql");


insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp,madv) values("canbo2","Cán Bộ 2","Quản Trị Hệ Thống","$2a$12$7IPrRR0TnN886WESk2hRKunDIizDUMKn02T13yMTMfcxnVRnBh6r2","vanthu","ql");
insert into cvden(macvden,tencvden,matt) values ("1","Đây là công văn test API",1);
insert into tt_bosung values(1,3,"Bình Thường","Bình Thường","Không có ghi chú thêm");

select * from cvden cv join tt_bosung tt on cv.matt=tt.matt where cv.macvden=1;

insert into LinhVuc(tenlv) values("Giáo Dục");
insert into LinhVuc(tenlv) values("Xã Hội");
insert into LinhVuc(tenlv) values("Văn Hóa");
insert into LinhVuc(tenlv) values("Công Nghệ");

insert into donvi(tendv) values ("Phòng kế hoạch tổng hợp");
insert into donvi(tendv) values ("Khoa Công Nghệ Thông Tin");

insert into loaicv(tenloai) values("Quyết Định");
insert into loaicv(tenloai) values("Nghị Quyết");

insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp,madv) values("quocquoc","Khánh Quốc","Quản Trị Hệ Thống","$2a$12$HwEzMDSMwWFwb.7nQ/j.6eyp8sgkMfn6X198hFx3B7umY.2WijWI2","lanhdao","ql",1);

insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp,madv) values("vantai","Văn Tài","Quản Trị","$2a$12$HwEzMDSMwWFwb.7nQ/j.6eyp8sgkMfn6X198hFx3B7umY.2WijWI2","lanhdao","ql",2);

select * from bophan;

select * from nhanvien where madv=1;

update nhanvien set quyen="lanhdao" where manv="b1809283";

alter table nhanvien add madv int;
alter table nhanvien add foreign key(madv) references donvi(madv);
update nhanvien set madv=1 where manv="b1809283";

select * from noinhancvdi;
select * from xulycvdi;
select * from donvi;
select * from linhvuc;


drop table nhapcvdi;
drop table cvdi;
drop table noinhancvdi;
drop table xulycvdi;
drop table myfulltext;

ALTER TABLE myfulltext  
ADD FULLTEXT(text);

select * from myfulltext limit 5000;
SHOW INDEXES FROM myfulltext;

delete from noinhancvdi where madv=2;
delete from loaicv where maloai=6;

select * from cvdi join donvi on cvdi.madv=donvi.madv;


SELECT `code`, `text`, `content`, `noidung`, `title` FROM `MyFullText` AS `myfulltext` WHERE MATCH (text) AGAINST ('Center');


