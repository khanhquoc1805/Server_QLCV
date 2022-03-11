
use quanlycongvan;
s

insert into socv values ("nd","Nghị Định","Sổ Văn Bản Đi","Phòng Kế Hoạch - Tổng Hợp");

select * from socv;

drop table socv;
delete from socv where masocv="VPDT";

select * from cvden;
select * from cvdi;
select * from tt_bosung;

delete from tt_bosung where matt!=12;
delete from cvdi where mavbdi !=8;



insert into bophan values("ql","Quản Lý");
insert into nhanvien(manv,tennv,chucvu,matkhau,quyen,mabp) values("c0928","Khánh Quốc","Quản Trị Hệ Thống","$2y$10$BOkz3s9agSLVm0Jw2yFj9eHqWC0AP.ChHWBDnIgLMIf1HLBER7qam","admin","ql");

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



select * from loaicv;
select * from donvi;
select * from linhvuc;
drop table cvdi;
drop table cvden;
drop table tt_bosung;

select * from tt_bosung;

delete from linhvuc where malv=11;
delete from loaicv where maloai=6;

select * from cvdi join donvi on cvdi.madv=donvi.madv;


