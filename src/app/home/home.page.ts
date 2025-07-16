import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  metaDiaria = 2000;
  quantidadeAtual = 0;
  altura = 0;

  constructor(private alertCtrl: AlertController, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();

    const hoje = new Date().toDateString();
    const ultimaData = await this.storage.get('data-ultima-visita');

    if (ultimaData !== hoje) {
      this.quantidadeAtual = 0;
      await this.storage.set('data-ultima-visita', hoje);
    }

    const metaStorage = await this.storage.get('meta-diaria');
    this.metaDiaria = metaStorage !== null ? metaStorage : this.metaDiaria;

    const qtdStorage = await this.storage.get('quantidade-atual');
    this.quantidadeAtual = qtdStorage !== null ? qtdStorage : this.quantidadeAtual;

    this.atualizarBarra();
  }

  private atualizarBarra() {
    const porcentagem = (this.quantidadeAtual / this.metaDiaria) * 100;
    this.altura = porcentagem;
    console.log(`Meta: ${this.metaDiaria}ml, Atual: ${this.quantidadeAtual}ml, ${porcentagem.toFixed(1)}%`);
  }

  private async atualizarMeta(valor: number) {
    this.metaDiaria = valor;
    await this.storage.set('meta-diaria', valor);
    this.atualizarBarra();
  }

  private async atualizarQuantidade(valor: number) {
    this.quantidadeAtual = valor;
    await this.storage.set('quantidade-atual', valor);
    this.atualizarBarra();
  }

  async metaAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Defina a meta diária',
      inputs: [{ type: 'number', placeholder: 'Meta diária (ml)', name: 'meta' }],
      buttons: [
        {
          text: 'OK',
          handler: (data) => this.atualizarMeta(Number(data.meta))
        }
      ]
    });
    await alert.present();
  }

  async quantidadeAtualAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Corrigir quantidade',
      inputs: [{ type: 'number', placeholder: 'Quantidade (ml)', name: 'quantidade' }],
      buttons: [
        {
          text: 'OK',
          handler: (data) => this.atualizarQuantidade(Number(data.quantidade))
        }
      ]
    });
    await alert.present();
  }

  addQuantidade(quantidade: number) {
    this.atualizarQuantidade(this.quantidadeAtual + quantidade);
  }

  corrigirQuantidade(quantidade: number) {
    this.atualizarQuantidade(quantidade);
  }
}
