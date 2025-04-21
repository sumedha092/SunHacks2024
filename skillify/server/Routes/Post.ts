import { RequestRouter } from '../../library/Interfaces/RequestRouter';
import { PostController } from '../../source/Controllers/PostController';
import { ValidRoutes } from '../ValidRoutes';

export class PostRouter extends RequestRouter {
  constructor() {
    super(PostController);
  }

  initializeRoutes() {
    this.router.post('/requests/new', (req, res) => {
      this.handleRequest(ValidRoutes.CreateRequest, req, res);
    });
    this.router.post('/skills/new', (req, res) => {
      this.handleRequest(ValidRoutes.CreateSkill, req, res);
    });
    this.router.post('/users/new', (req, res) => {
      this.handleRequest(ValidRoutes.CreateUser, req, res);
    });
  }
}
