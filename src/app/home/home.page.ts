import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  metaDiaria: number = 2000;
  quantidadeAtual: number = 0;

  constructor(private alertCtrl: AlertController, private storage: Storage) { }

  async metaAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Defina a meta diária',
      inputs: [
        {
          type: 'number',
          placeholder: 'Meta diária (ml)',
          name: 'meta'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.metaDiaria = Number(data.meta);
            this.storage.set('meta-diaria', this.metaDiaria);
          }
        }
      ]
    });
    await alert.present();
  }

  async quantidadeAtualAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Corrigir quantidade',
      inputs: [
        {
          type: 'number',
          placeholder: 'Quantidade (ml)',
          name: 'quantidade'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.quantidadeAtual = Number(data.quantidade);
            this.storage.set('quantidade-atual', this.quantidadeAtual);
          }
        }
      ]
    });
    await alert.present();
  }

  async ngOnInit() {
    await this.storage.create();

    const metaDiariaStorage = await this.storage.get('meta-diaria');
    const quantidadeAtualStorage = await this.storage.get('quantidade-atual');

    if (metaDiariaStorage) {
      this.metaDiaria = await this.storage.get('meta-diaria')
    } else {
      await this.storage.set('meta-diaria', this.metaDiaria);
    }
    
    if (quantidadeAtualStorage) {
      this.quantidadeAtual = await this.storage.get('quantidade-atual')
    } else {
      await this.storage.set('quantidade-atual', this.quantidadeAtual);
    }
  }

  addQuantidade(quantidade: number) {
    this.quantidadeAtual += quantidade;
    this.storage.set('quantidade-atual', this.quantidadeAtual);
  }

  corrigirQuantidade(quantidade: number) {
    this.quantidadeAtual = quantidade;
    this.storage.set('quantidade-atual', this.quantidadeAtual);
  }
}
