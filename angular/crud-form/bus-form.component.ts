import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Observable, Subject, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormData, CRUDFormDataSource, FormState } from 'eui';

import { ParkingLotService } from './parking-lot.service';
import { BusService } from './bus.service';
import { Bus } from './bus';
import { ParkingLot } from './parking-lot';


class BusFormDataSource implements CRUDFormDataSource<Bus> {
  constructor(
    private projectId: number,
    private parkingLot: ParkingLot | null,
    public pk: number | null,
    private busService: BusService) {
  }

  toView(bus: Bus | null): FormData {
    return bus === null ? {
      parking_lot: this.parkingLot
    } : {
      name: bus.name,
      parking_lot: bus.parking_lot,
      capacity: bus.capacity,
      fuel_consumption: bus.fuel_consumption,
      fuel_price: bus.fuel_price,
      salary: bus.salary
    };
  }

  toModel(data: FormData): Bus {
    return {
      pk: this.pk,
      name: data.name,
      parking_lot: data.parking_lot,
      capacity: data.capacity,
      fuel_consumption: data.fuel_consumption,
      fuel_price: data.fuel_price,
      salary: data.salary,
      schedule: null
    };
  }

  getItem(): Observable<Bus> {
    return this.busService.getBus(this.projectId, this.pk);
  }

  saveItem(bus: Bus): Observable<Bus> {
    return this.busService.saveBus(this.projectId, bus);
  }

  deleteItem(): Observable<void> {
    return this.busService.deleteBus(this.projectId, this.pk);
  }
}


@Component({
  selector: 'idd-st-bus-form',
  templateUrl: './bus-form.component.html'
})
export class BusFormComponent implements OnInit, OnChanges {
  @Input() projectId: number;
  @Input() busId: number | null;
  @Input() parkingLotId: number | null = null;
  @Output() add: EventEmitter<Bus> = new EventEmitter<Bus>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() busChange: EventEmitter<Bus | null> = new EventEmitter<Bus | null>(true);
  dataSource$: Observable<BusFormDataSource>;
  parkingLotSuggestionsQuery$: Subject<string> = new Subject<string>();
  parkingLotSuggestions$: Observable<ParkingLot[]>;

  constructor(
    private parkingLotService: ParkingLotService,
    private busService: BusService) {
  }

  ngOnInit(): void {
    this.parkingLotSuggestions$ = combineLatest(
      this.parkingLotService.getParkingLots(this.projectId),
      this.parkingLotSuggestionsQuery$
    ).pipe(
      map(([parkingLots, query]: [ParkingLot[], string]) => {
        return parkingLots.filter((parkingLot: ParkingLot) =>
          this.parkingLotDisplayFn(parkingLot).startsWith(query));
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.busId || changes.parkingLotId) {
      if (this.parkingLotId === null) {
        this.dataSource$ = of(new BusFormDataSource(this.projectId, null, this.busId, this.busService));
      } else {
        this.dataSource$ = this.parkingLotService.getParkingLot(this.projectId, this.parkingLotId).pipe(
          map((parkingLot: ParkingLot) => new BusFormDataSource(this.projectId, parkingLot, this.busId, this.busService))
        );
      }
    }
  }

  parkingLotDisplayFn(parkingLot: ParkingLot): string {
    return parkingLot.name;
  }
}
