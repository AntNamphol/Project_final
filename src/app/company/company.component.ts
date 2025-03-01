import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopUpEditCompComponent } from '../pop-up-edit-comp/pop-up-edit-comp.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  providers: [ConfirmationService, MessageService,DialogService]
})
export class CompanyComponent implements OnInit{
  visible: boolean = false;
  name_comp:string='';
  num_comp:string='';
  email_comp:string='';
  comp_address:string='';
  companies:any[] = [];
  compS:any;
  searchComName:string='';
  constructor(private http:HttpClient,private messageService: MessageService,private dialogService: DialogService,private confirmationService: ConfirmationService){

  }

  ngOnInit(): void {
    this.load_comp()
  }
  searchAfbIdChange(company_name: string) {
    this.compS = this.companies.filter(item => item.company_name.includes(company_name));
    console.log(this.compS);
  }
  
  showDialog() {
      this.visible = true;
  }
  save_comp() {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (this.name_comp && this.num_comp && this.comp_address && this.email_comp) {
      const data = {
        name_comp: this.name_comp,
        num_comp: this.num_comp,
        email_comp: this.email_comp,
        comp_address: this.comp_address
      };
      const url = 'http://localhost/backend/add_comp.php';
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(url, data, { headers }).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายชื่อบริษัทเสร็จสิ้น' });
          this.load_comp();
          this.visible = false;
        },
        (error) => {
          console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
          this.messageService.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
  }

  load_comp(){
    const url = 'http://localhost/backend/load_comp.php';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.companies = response;
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการรับข้อมูล:', error);
      }
    );
  }
  editCompany(company_id: number) {
    const ref = this.dialogService.open(PopUpEditCompComponent, {
      header: 'แก้ไขรายชื่อบริษัท',
      width: '60%',
      data: {
        company_id: company_id
      }
    });
  
    ref.onClose.subscribe((result) => {
      console.log('Dialog closed:', result);
      // ทำสิ่งที่ต้องการเมื่อ Dialog ถูกปิด
    });
  }

  deleteCompany(event:Event,company_id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'ต้องการลบผู้จัดหาหรือไม่?',
      header: 'ทบทวนการกระทำ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'ยืนยัน',
      rejectLabel:'ยกเลิก',
      rejectButtonStyleClass:'p-button-outlined',
      accept: () => {
        const url = `http://localhost/backend/delete_company.php`;
        const data = { company_id };
        this.http.post<any>(url,data ).subscribe(res => {
          if(res && res.status == 'success'){
            this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบรายชื่อบริษัทเสร็จสิ้น', life: 3000 });
            this.load_comp();
          }else{
            this.messageService.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: 'รายชื่อบริษัทมีการใช้งานอยู่', life: 3000 });
          }
        }

        );
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'ยกเลิก', detail: 'ยกเลิกการกระทำ', life: 3000 });
      }
  });
  }
}
