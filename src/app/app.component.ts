import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from "@angular/core";
import {
  BrowserJsPlumbInstance,
  ContainmentType,
  EVENT_DRAG_STOP,
  EVENT_ENDPOINT_MOUSEOUT,
  EVENT_ENDPOINT_MOUSEOVER,
  newInstance,
  ready
} from "@jsplumb/browser-ui";
import { FlowchartConnector } from "@jsplumb/connector-flowchart";
import { AnchorLocations, AnchorSpec, AnchorOptions } from "@jsplumb/common";

import {
  Connection,
  ConnectionEstablishedParams,
  Endpoint,
  EndpointOptions,
  EVENT_CONNECTION
} from "@jsplumb/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild("wrapper", { static: true }) wrapper: ElementRef;
  instance: BrowserJsPlumbInstance;
  nodes: Node[] = [];
  constructor() {}
  connectorPaintStyle = {
    stroke: "#58b7f6",
    strokeWidth: 2
  };
  connectorHoverStyle = {
    stroke: "#58b7f6",
    strokeWidth: 4
  };
  sourceEndpoint = {
    endpoint: {
      type: "Dot",
      options: { radius: 10, cssClass: "endpoint source-endpoint" }
    },
    paintStyle: {
      fill: "#fffhdg",
      stroke: "none"
    },
    source: true,
    target: false,
    connectorStyle: this.connectorPaintStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    maxConnections: 4,
    scope: "jsplumb_defaultscope"
  };
  targetEndpoint = {
    endpoint: {
      type: "Dot",
      options: { radius: 7, cssClass: "endpoint" }
    },
    paintStyle: {
      fill: "none"
    },
    maxConnections: 4,
    source: false,
    target: true,
    uniqueEndpoint: true,
    deleteEndpointsOnDetach: false
  };
  dragOptions = {
    zIndex: 2000,
    containment: ContainmentType.notNegative
  };
  connectionOverlays = [
    {
      type: "Arrow",
      options: {
        location: 1,
        length: 14,
        foldback: 0.8
      }
    }
  ];
  connectorProp = {
    type: FlowchartConnector.type,
    options: {
      stub: [10, 15],
      alwaysRespectStubs: true,
      cornerRadius: 20,
      midpoint: 0.2
    }
  };
  ngOnInit() {
    this.instance = newInstance({
      dragOptions: this.dragOptions,
      connectionOverlays: this.connectionOverlays,
      connector: this.connectorProp,
      container: this.wrapper.nativeElement
    });

    this.instance.addTargetSelector(".box", {
      ...this.targetEndpoint,
      ...{
        anchor: "ContinuousLeft",
        scope: "target_scope"
      }
    });
  }
  _addEndPoints2(id: string, sourceAnchors: Array<AnchorSpec>) {
    const element = this.instance.getManagedElement(id);
    for (let i = 0; i < sourceAnchors.length; i++) {
      const sourceUUID = id + sourceAnchors[i];
      this.instance.addEndpoint(element, this.sourceEndpoint, {
        anchor: "Right",
        uuid: sourceUUID,
        scope: "target_scope"
      });
    }
  }
  addNode() {
    let config: any = { id: `node${this.nodes.length + 1}` };
    this.nodes.push(config);
    this.manageNode(config.id);
    console.log(this.nodes);
  }
  manageNode(id: string) {
    setTimeout(() => {
      this.instance.manage(document.getElementById(id));
      this._addEndPoints2(id, ["Right"]);
    });
  }
}
