import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Report from "../../report/model/report.entity";
import { Repository } from "typeorm";
import { UpdateCaseFileDto } from "../dto/update-case-file.dto";
import CaseFile from "../entities/case-file.entity";
import { AddReportToCaseFileDto } from "../dto/add-report-case.dto";
import User from "../../user/entities/user.entity";


import {
  AddCommentToCaseFileDto,
  UpdateCaseFileCommentDto,
} from "../dto/comment.dto";
import { Comment } from "../entities/comment.entity";
import { CaseFileStatus } from "../entities/case-status.entity";
import { AssignCaseFileDto } from "../dto/assign-case.dto";
import { Actions } from "../../shared/actions/actions";
import ReportThreshold from "../../report/model/report-threshold.entity";
import FraudNumberEntity from "../../fraud-number/model/fraud-number.entity";
import { FraudNumberService } from "src/fraud-number/services/fraud-number.service";
import { ApiResponse } from "src/sms/type/api-response";
import { JwtPayload } from "src/authentication/dtos/jwt.payload";

@Injectable()
export class CaseFileService {
  constructor(
    @InjectRepository(CaseFile)
    private readonly caseFileRepository: Repository<CaseFile>,

    @InjectRepository(CaseFileStatus)
    private readonly caseFileStatusRepository: Repository<CaseFileStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,

    @InjectRepository(FraudNumberEntity)
    private readonly fraudNumberRepository: Repository<FraudNumberEntity>,

    @InjectRepository(ReportThreshold)
    private readonly reportThresholdRepository: Repository<ReportThreshold>,

    private readonly fraudNumberService: FraudNumberService
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException(
          "Not null violation: Please provide all required fields."
        );
      case "23503":
        throw new BadRequestException(
          "Foreign key violation: The referenced record does not exist."
        );
      case "23505":
        throw new ConflictException(
          "Unique violation: The provided data violates a unique constraint."
        );
      case "42703":
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      default:
        throw error;
    }
  }

  private async getCaseFileStatus(statusId: string): Promise<CaseFileStatus> {
    let statusFound: CaseFileStatus = null;
    if (statusId) {
      statusFound = await this.caseFileStatusRepository.findOne({
        where: { statusId },
      });
    } else {
      statusFound = await this.caseFileStatusRepository.findOne({
        where: { name: "opened" },
      });
    }

    if (statusFound !== null) {
      return statusFound;
    } else {
      throw new NotFoundException("Case file status not found");
    }
  }

  public async createCaseFile(caseFileData: AddReportToCaseFileDto) {
    const { statusId, remark, suspectNumber } = caseFileData;

    try {
      const currentThreshold =
        await this.reportThresholdRepository.findOneOrFail({
          where: { name: "reportThreshold" },
        });

      const [caseStatus, suspectCaseFileExist, suspectReports] =
        await Promise.all([
          this.getCaseFileStatus(statusId),
          this.caseFileRepository.findOne({
            where: { suspectNumber },
            relations: { reports: true },
          }),
          this.reportRepository.find({
            where: { suspectNumber },
          }),
        ]);
      if (!suspectCaseFileExist) {
        if (suspectReports.length >= currentThreshold.reportCount) {
          const newCaseFile = this.caseFileRepository.create({
            suspectNumber,
            remark,
            status: caseStatus,
            reports: [],
          });
          newCaseFile.reports = suspectReports;
          await this.caseFileRepository.save(newCaseFile);

          if (caseStatus.name.includes("approved")) {
            await this.updateFraudNumberApproval(suspectNumber);
          }

          return {
            message: "Case file created",
            data: newCaseFile,
            statusCode: HttpStatus.CREATED,
          };
        }
        return {
          message: "Insufficient reports to create a case file",
          data: null,
          statusCode: HttpStatus.OK,
        };
      }

      suspectCaseFileExist.reports = suspectReports;
      await this.caseFileRepository.save(suspectCaseFileExist);

      if (caseStatus.name.includes("approved")) {
        await this.updateFraudNumberApproval(suspectNumber);
      }

      return {
        message: "Case file updated",
        data: suspectCaseFileExist,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async updateFraudNumberApproval(suspectNumber: string) {
    const fraudNumber = await this.fraudNumberRepository.findOne({
      where: { fraudNumber: suspectNumber },
    });

    if (fraudNumber) {
      fraudNumber.approved = true;
      await this.fraudNumberRepository.save(fraudNumber);
    }
  }

  // get all case files
  public async getCaseFiles(): Promise<ApiResponse> {
    try {
      const result = await this.caseFileRepository.find({
        relations: { status: true, investigator: true },
        order: {
          modifiedAt: "DESC",
        },
      });

      return {
        message: "Case files fetched",
        statusCode: HttpStatus.FOUND,
        data: result,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  //get a case file by id
  public async getCaseFileById(caseFileId: string): Promise<ApiResponse> {
    try {
      let caseFileExist = await this.caseFileRepository.findOne({
        where: { caseId: caseFileId },
        relations: {
          status: true,
          investigator: true,
          reports: {
            reportPlatForm: true,
          },
          comments: {
            user: true,
          },
        },
      });
      if (caseFileExist !== null) {
        return {
          message: "Case file found",
          statusCode: HttpStatus.FOUND,
          data: caseFileExist,
          error: null,
        };
      }
      throw new NotFoundException("Case file not found");
    } catch (error) {
      throw error;
    }
  }

  public async getCaseFileInvestigatorId(
    investigatorId: string
  ): Promise<ApiResponse> {
    try {
      let caseFileExist = await this.caseFileRepository.find({
        where: { investigatorId },
        relations: {
          status: true,
          investigator: true,
          reports: {
            reportPlatForm: true,
          },
          comments: {
            user: true,
          },
        },
      });
      if (caseFileExist !== null) {
        return {
          message: "Case file found",
          statusCode: HttpStatus.FOUND,
          data: caseFileExist,
          error: null,
        };
      }
      throw new NotFoundException("Case file not found");
    } catch (error) {
      throw error;
    }
  }

  public async getCaseFileBySuspectNumber(
    phoneNumber: string
  ): Promise<ApiResponse> {
    try {
      let caseFileExist = await this.caseFileRepository.findOne({
        where: { suspectNumber: phoneNumber },
        relations: {
          status: true,
          reports: true,
          comments: {
            user: true,
          },
        },
      });
      if (caseFileExist !== null) {
        return {
          message: "Case file found",
          statusCode: HttpStatus.FOUND,
          data: caseFileExist,
          error: null,
        };
      }
      throw new NotFoundException("Suspect number not found");
    } catch (error) {
      throw error;
    }
  }

  public async updateCaseFile(
    caseId: string,
    updateCaseFileDto: UpdateCaseFileDto,
    user: JwtPayload
  ) {
    const { remark, statusId } = updateCaseFileDto;
    try {
      const [caseExist, caseStatus] = await Promise.all([
        this.caseFileRepository.findOne({
          where: { caseId },
          relations: { status: true },
        }),
        statusId
          ? this.caseFileStatusRepository.findOne({ where: { statusId } })
          : null,
      ]);

      if (!caseExist) {
        throw new NotFoundException(`Record for ${caseId} not found`);
      }

      if (statusId) {
        if (!caseStatus) {
          throw new NotFoundException(
            `Case status with ID ${statusId} not found`
          );
        }

        const statusName = caseStatus.name;
        this.checkAdminPermission(statusName, user?.sub);
        caseExist.status = caseStatus;

        if (
          statusName.includes("approved") ||
          statusName.includes("investigation")
        ) {
          const fraudNumber = await this.fraudNumberRepository.findOne({
            where: { fraudNumber: caseExist.suspectNumber },
            relations: {
              reports: true,
            },
          });

          if (fraudNumber) {
            if (statusName.includes("approved")) {
              fraudNumber.approved = true;
              fraudNumber.visibility = true;
              fraudNumber.investigated = true;
            } else if (statusName.includes("investigation")) {
              fraudNumber.investigated = true;
            }

            await this.fraudNumberService.updateReports(fraudNumber);
            await this.fraudNumberService.calculateRiskLevel(
              fraudNumber?.fraudNumber
            );
          }
        }
      }

      if (remark) {
        this.checkAdminPermission("addRemark", user?.role);
        caseExist.remark = remark;
      }

      await this.caseFileRepository.save(caseExist);
      return {
        message: "Case file updated",
        data: caseExist,
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Helper method to check if a role has a specific permission
  private hasPermission(role: string, targetRoleName: string): boolean {
    return role === targetRoleName;
  }

  // Helper method to check admin permission based on statusId or action
  private checkAdminPermission(action: string, role: string): void {
    const isAdmin = this.hasPermission(role, "admin");

    switch (action.toLowerCase().trim()) {
      case Actions.approved:
      case Actions.approval_denied:
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can update caseStatus to approved or denied-approval."
          );
        }
        break;

      case Actions.addRemark:
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can add remarks to case files."
          );
        }
        break;
      case Actions.assignment:
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can assign users to case files."
          );
        }
        break;
      case "removeCaseFile":
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can remove case files."
          );
        }
        break;
      default:
        break;
    }
  }

  // remove a case file record with id
  async removeCaseFile(caseId: string, role: string): Promise<object> {
    try {
      this.checkAdminPermission(Actions.removeCaseFile, role);
      const deleteResult = await this.caseFileRepository.delete(caseId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Case with ID: ${caseId} not found`);
      }

      return {
        message: "CaseFile removed successfully",
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      throw error;
    }
  }

  // add remarks
  public async addComment(
    caseId: string,
    user: JwtPayload,
    commentData: AddCommentToCaseFileDto
  ) {
    try {
      const [caseFileFound, userFound] = await Promise.all([
        this.caseFileRepository.findOne({
          where: { caseId },
          relations: {
            comments: true,
          },
        }),
        this.userRepository.findOne({
          where: { userId: user?.sub },
          relations: { comments: true },
        }),
      ]);
      if (!caseFileFound || !userFound) {
        throw new BadRequestException("Case file or user not found");
      }
      const newComment = new Comment();
      newComment.caseFile = caseFileFound;
      newComment.user = userFound;
      newComment.notes = commentData.notes;

      await this.commentRepository.save(newComment);
      return {
        message: "Comment created.",
        data: newComment,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async updateCaseFileComment(
    commentId: string,
    commentData: UpdateCaseFileCommentDto,
    user: JwtPayload
  ) {
    try {
      const { notes } = commentData;
      const commentToUpdate = await this.commentRepository.findOne({
        where: { commentId },
        relations: { user: true },
      });

      if (!commentToUpdate) {
        throw new NotFoundException("Comment not found");
      }
      if (commentToUpdate.user.userId !== user?.sub) {
        throw new UnauthorizedException("Cannot edit comment");
      }
      if (notes) commentToUpdate.notes = notes;

      await this.commentRepository.save(commentToUpdate);
      return {
        message: "Commented updated.",
        data: commentToUpdate,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeComment(commentId: string): Promise<ApiResponse> {
    try {
      const deleteResult = await this.commentRepository.delete(commentId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException("Comment not found.");
      }
      return {
        message: "Case file removed",
        statusCode: HttpStatus.FOUND,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCommentsByCaseId(caseFileId: string): Promise<ApiResponse> {
    try {
      const result = await this.commentRepository.find({
        where: { caseFile: { caseId: caseFileId } },
      });

      return {
        message: "Case file comments fetched",
        statusCode: HttpStatus.FOUND,
        data: result,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  // public async get total case file records
  public async getTotalCaseFileRecords(): Promise<number> {
    try {
      return await this.caseFileRepository.count();
    } catch (error) {
      throw error;
    }
  }

  async assignCaseFileToInvestigator(
    user: JwtPayload,
    caseFileId: string,
    assignedData: AssignCaseFileDto
  ): Promise<ApiResponse> {
    const userRole = user.role;
    const { investigatorId } = assignedData;
    try {
      this.checkAdminPermission(Actions.assignment, userRole);
      const caseFile = await this.caseFileRepository.findOne({
        where: { caseId: caseFileId },
      });
      if (!caseFile) {
        throw new NotFoundException(
          `Case file with ID ${caseFileId} not found.`
        );
      }
      const investigator = await this.userRepository.findOne({
        where: { userId: investigatorId },
      });
      if (!investigator)
        throw new NotFoundException(
          `Investigator with Id:${investigatorId} not found`
        );

      caseFile.investigator = investigator;
      caseFile.investigatorId = investigatorId;

      await this.caseFileRepository.save(caseFile);
      return {
        message: `Case has been assigned to user successfully`,
        data: caseFile,
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async autoAssignToInvestigator(caseFileId: string): Promise<void> {
    const investigator = await this.userRepository.findOne({
      where: { role: { roleName: "investigator" } },
      order: {
        lastAssigned: "ASC",
      },
    });
    const caseFile = await this.caseFileRepository.findOne({
      where: { caseId: caseFileId },
      relations: ["investigator"],
    });

    if (!investigator || !caseFile || caseFile.investigator) {
      return;
    }

    caseFile.investigator = investigator;
    caseFile.investigatorId = investigator.userId;

    // Update lastAssigned date for load balancing
    investigator.lastAssigned = new Date();
    await this.userRepository.save(investigator);

    await this.caseFileRepository.save(caseFile);
  }
}
