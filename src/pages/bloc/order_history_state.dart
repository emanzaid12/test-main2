part of 'order_history_bloc.dart';

sealed class OrderHistoryState extends Equatable {
  const OrderHistoryState();
  
  @override
  List<Object> get props => [];
}

final class OrderHistoryInitial extends OrderHistoryState {}
