import { Controller, Get, Param, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/board')
export class BoardRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render('board/index')
  root() {
    const projects = this.configService.get('projects');

    return {
      projects
    };
  }

  @Get('/:projectId/:boardName')
  @Render('board/board')
  async board(
    @Param('projectId') projectId: string,
    @Param('boardName') boardName: string
  ) {
    const project = this.configService
      .get('projects')
      .find((project) => project.id === projectId);

    const board = project.boards.find((board) => board.name === boardName);

    const tickets = await this.ticketService.search({
      project: projectId
    });

    board.columns = board.columns.map((column) => ({
      ...column,
      tickets: tickets.filter((ticket) =>
        column.status.includes(ticket.status.name)
      )
    }));

    return {
      project,
      tickets,
      board
    };
  }
}
