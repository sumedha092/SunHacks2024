import { RequestRouter } from '../../library/Interfaces/RequestRouter';
import { PutController } from '../../source/Controllers/PutController';
import { ValidRoutes } from '../ValidRoutes';

export class PutRouter extends RequestRouter {
  constructor() {
    super(PutController);
  }

  initializeRoutes() {
    this.router.put('/users', (req, res) => {
      this.handleRequest(ValidRoutes.UpdateUser, req, res);
    });

    this.router.put('/requests/accept', (req, res) => {
      this.handleRequest(ValidRoutes.AcceptRequest, req, res);
    });

    this.router.put('/requests/deny', (req, res) => {
      this.handleRequest(ValidRoutes.DenyRequest, req, res);
    });
  }
}
