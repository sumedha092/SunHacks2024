import { RequestRouter } from '../../library/Interfaces/RequestRouter';
import { GetController } from '../../source/Controllers/GetController';
import { ValidRoutes } from '../ValidRoutes';

export class GetRouter extends RequestRouter {
  constructor() {
    super(GetController);
  }

  initializeRoutes() {
    this.router.get('/requests/sent', (req, res) => {
      this.handleRequest(ValidRoutes.GetSentRequests, req, res);
    });

    this.router.get('/requests/received', (req, res) => {
      this.handleRequest(ValidRoutes.GetReceivedRequests, req, res);
    });

    this.router.get('/skills', (req, res) => {
      this.handleRequest(ValidRoutes.GetSkills, req, res);
    });

    this.router.get('/users', (req, res) => {
      this.handleRequest(ValidRoutes.GetUsers, req, res);
    });

    this.router.get('/user', (req, res) => {
      this.handleRequest(ValidRoutes.GetUser, req, res);
    });

    this.router.get('/users/skill', (req, res) => {
      this.handleRequest(ValidRoutes.GetUsersBySkill, req, res);
    });
  }
}
