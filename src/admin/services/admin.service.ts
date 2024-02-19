import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import {
  CreateDeliveryFeeDto,
  OrderRepository,
  UpdateDeliveryFeeDto,
} from 'src/order';
import { OrderService } from 'src/order/services/order.service';
import {
  AddCategoryDto,
  ConfirmOrder,
  CreateProductDto,
  EditCategoryDto,
  EditProductDto,
  GetProductsQueryDto,
} from '../dtos';
import {
  CategoryDocument,
  CategoryRepository,
  ProductRepository,
} from 'src/product';
import { FindManyDto, MongoIdDto, OrderStatus } from 'src/common';

@Injectable()
export class AdminService {
  private readonly logger: Logger = new Logger(AdminService.name);
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly orderService: OrderService,
    private readonly productsRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  async createDeliveryFee(body: CreateDeliveryFeeDto) {
    const newDeliveryFee = await this.orderService.createDeliveryFee(body);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully created delivery fee',
      data: newDeliveryFee,
    };
  }

  async updateDeliveryFee(id: string, body: UpdateDeliveryFeeDto) {
    const updatedDeliveryFee = await this.orderService.updateDeliveryFee(
      id,
      body,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated delivery fee',
      data: updatedDeliveryFee,
    };
  }

  async getDeliveryFees() {
    const { data } = await this.orderService.getDeliveryFees();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched delivery fees',
      data: data,
    };
  }

  async getDeliveryFeeById({ id }: MongoIdDto) {
    const { data } = await this.orderService.getDeliveryFeeById(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched delivery fee',
      data: data,
    };
  }

  async deleteDeliveryFee(id: string) {
    const updatedDeliveryFee = await this.orderService.deleteDeliveryFee(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully deleted delivery fee',
      data: updatedDeliveryFee,
    };
  }

  async addCategory(body: AddCategoryDto) {
    const newCategory = await this.categoryRepo.create({ ...body });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully added category',
      data: newCategory,
    };
  }

  async editCategory({ id }: MongoIdDto, body: EditCategoryDto) {
    const { description, image, name } = body;
    const foundCatgeoryInDb = await this.categoryRepo.findOne({ _id: id });
    if (!foundCatgeoryInDb) throw new NotFoundException(`Category not found`);
    foundCatgeoryInDb.image = image ? image : foundCatgeoryInDb.image;
    foundCatgeoryInDb.name = name ? name : foundCatgeoryInDb.name;
    foundCatgeoryInDb.description = description
      ? description
      : foundCatgeoryInDb.description;
    const updatedCategoryInDb = await foundCatgeoryInDb.save();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully added category',
      data: updatedCategoryInDb,
    };
  }

  async getAllCategories() {
    const foundCategorys = await this.categoryRepo.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved Categories',
      data: foundCategorys,
    };
  }

  async getCategoryById({ id }: MongoIdDto) {
    const foundCategoryInDb = await this.categoryRepo.findById(id);
    if (!foundCategoryInDb) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved Category',
      data: foundCategoryInDb,
    };
  }

  async deleteCategoryById({ id }: MongoIdDto) {
    const deletedCategoryInDb = await this.categoryRepo.findOneAndDelete({
      _id: id,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully deleted Category',
      data: deletedCategoryInDb,
    };
  }

  async createNewProduct(body: CreateProductDto) {
    const { categoryId } = body;

    const foundCategoryInDb = await this.categoryRepo.findOne({
      _id: categoryId,
    });
    if (!foundCategoryInDb) throw new NotFoundException(`Category not found`);

    const newProduct = await this.productsRepo.create({
      ...body,
      category: foundCategoryInDb,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully created product',
      data: newProduct,
    };
  }

  async getProducts(query: GetProductsQueryDto) {
    const { search, categoryId } = query;
    const condition = {};

    if (search) {
      condition['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId) {
      condition['category'] = categoryId;
    }

    const foundProducts = await this.productsRepo.findManyWithPagination(
      condition,
      query,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProducts,
    };
  }

  async getProductById({ id }: MongoIdDto) {
    const foundProductInDb = await this.productsRepo.findOne({ _id: id });
    if (!foundProductInDb)
      throw new NotFoundException(`Product with id: ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved product',
      data: foundProductInDb,
    };
  }

  async editProductById({ id }: MongoIdDto, body: EditProductDto) {
    const {
      categoryId,
      description,
      image,
      name,
      noOfUnitsAvailable,
      price,
      rating,
      inStock,
      isFlashSale,
      purchasable,
    } = body;
    let foundCategoryInDb: CategoryDocument;
    const foundProductInDb = await this.productsRepo.findOne({ _id: id });
    if (!foundProductInDb)
      throw new NotFoundException(`Product with id: ${id} not found`);

    if (categoryId) {
      foundCategoryInDb = await this.categoryRepo.findOne({ _id: categoryId });
      if (!foundCategoryInDb)
        throw new NotFoundException(`Category with id: ${id} not found`);
      foundProductInDb.category = foundCategoryInDb;
    }
    foundProductInDb.description = description
      ? description
      : foundProductInDb.description;
    foundProductInDb.image = image ? image : foundProductInDb.image;
    foundProductInDb.name = name ? name : foundProductInDb.name;
    foundProductInDb.noOfUnitsAvailable = noOfUnitsAvailable
      ? noOfUnitsAvailable
      : foundProductInDb.noOfUnitsAvailable;
    foundProductInDb.price = price ? price : foundProductInDb.price;
    foundProductInDb.rating = rating ? rating : foundProductInDb.rating;
    foundProductInDb.inStock = inStock ? inStock : foundProductInDb.inStock;
    foundProductInDb.purchasable = purchasable
      ? purchasable
      : foundProductInDb.purchasable;
    foundProductInDb.isFlashSale = isFlashSale
      ? isFlashSale
      : foundProductInDb.isFlashSale;

    const updatedProductInDb = await foundProductInDb.save();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully edited product',
      data: updatedProductInDb,
    };
  }

  async deleteProductById({ id }: MongoIdDto) {
    const deletedProductFromDb = await this.productsRepo.findOneAndDelete({
      _id: id,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved product',
      data: deletedProductFromDb,
    };
  }

  async fetchAllOrders(query: FindManyDto) {
    const { search } = query;
    const condition = {};

    if (search) {
      condition['$or'] = [
        { email: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    const foundOrdersInDb = await this.orderRepo.findManyWithPagination(
      condition,
      {
        ...query,
        populate: [
          { path: 'discountVoucher' },
          { path: 'deliveryFee' },
          { path: 'products', populate: { path: 'productId' } },
          { path: 'user' },
        ],
      },
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched orders',
      data: foundOrdersInDb,
    };
  }

  async fetchOrderById({ id }: MongoIdDto) {
    const foundOrderInDb = await this.orderRepo.findOne({ _id: id }, null, {
      populate: [
        { path: 'discountVoucher' },
        { path: 'deliveryFee' },
        { path: 'products', populate: { path: 'productId' } },
        { path: 'user' },
      ],
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched order',
      data: foundOrderInDb,
    };
  }

  async confirmOrder({ id }: MongoIdDto, body: ConfirmOrder) {
    const { confirm } = body;
    const foundOrderInDb = await this.orderRepo.findOne({ _id: id }, null, {
      populate: [
        { path: 'discountVoucher' },
        { path: 'deliveryFee' },
        { path: 'products', populate: { path: 'productId' } },
        { path: 'user' },
      ],
    });
    if (!foundOrderInDb) throw new NotFoundException(`Order not found`);
    foundOrderInDb.status =
      confirm === true ? OrderStatus.COMPLETED : OrderStatus.CANCELLED;

    const updatedOrderInDb = await foundOrderInDb.save();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully confirmed order',
      data: updatedOrderInDb,
    };
  }
}
