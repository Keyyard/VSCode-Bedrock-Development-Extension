import { BulkRegistration, Connection } from "vscode-languageserver";
import { IExtendedLogger } from "../logger/logger";
import { BaseService } from "../services/base";
import { IService } from "../services/service";
import { Identification } from "@blockception/shared";
import { Settings, ExtensionContext } from "../extension";
import { getProject } from "../../project/mcprojects";
import { DidChangeConfigurationNotification, DidChangeConfigurationParams } from "vscode-languageserver-protocol";

export class ConfigurationService extends BaseService implements Partial<IService> {
  name: string = "configuration";

  constructor(logger: IExtendedLogger, extension: ExtensionContext) {
    super(logger.withPrefix("[configuration]"), extension);
  }

  setupHandlers(connection: Connection): void {
    this.addDisposable(connection.onDidChangeConfiguration(this.updateSettings.bind(this)));
  }

  dynamicRegister(register: BulkRegistration): void {
    register.add(DidChangeConfigurationNotification.type, {
      section: "BC-MC",
    });
  }

  async updateSettings(params?: DidChangeConfigurationParams) {
    this.logger.info("updating settings", params);
    const settings =
      params?.settings ??
      (await this.extension.connection.workspace.getConfiguration(Identification.SettingsConfigurationIdentifier));

    //If settings is nothing then skip it.
    if (settings === undefined || settings === null) return;

    if (Settings.is(settings)) {
      this.extension.settings = settings;

      //Update existing settings
      const workspace = this.extension.database.WorkspaceData;
      workspace.forEach((value, uri) => {
        workspace.set(uri, getProject(uri, this.extension.settings));
      });
    }
  }

  start(): void {
    void this.updateSettings();
  }
}