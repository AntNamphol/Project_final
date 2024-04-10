import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-edit-chanwang',
  templateUrl: './dialog-edit-chanwang.component.html',
  styleUrls: ['./dialog-edit-chanwang.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class DialogEditChanwangComponent implements OnInit{
  material_class_shelf_id:any;
  edit_chanwang:any;
  chan:any;
  constructor(private http:HttpClient,public config: DynamicDialogConfig,public ref: DynamicDialogRef,private confirmationService: ConfirmationService, private messageService: MessageService,private router:Router){

  }

  ngOnInit(): void {
    this.material_class_shelf_id = this.config.data.material_class_shelf_id;
    this.load();
  }
  load(){
    const url = 'http://localhost/backend/loadchanwang.php';
    const data = { material_class_shelf_id:this.material_class_shelf_id };
    this.http.post<any>(url,data).subscribe(ress => {
      this.chan = ress;

    });
  }
  save_eiei(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'ต้องการแก้ไขชั้นวางหรือไม่',
      acceptLabel:'ยืนยัน',
      rejectLabel:'ยกเลิก',
      rejectButtonStyleClass:'p-button-outlined',
      accept: () => {
        const url = 'http://localhost/backend/edit_chan.php';
    const data = {edit_chanwang:this.edit_chanwang,material_class_shelf_id:this.material_class_shelf_id};
        this.http.post<any>(url, data).subscribe(res => {
          if (res && res.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แก้ไขสำเร็จ', life: 3000 });
            window.location.reload();
            
          } else {
            this.messageService.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: 'แก้ไขไม่สำเร็จ', life: 3000 });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'ยกเลิก', detail: 'ยกเลิกการกระทำ', life: 3000 });
      }
  });
  }
}
